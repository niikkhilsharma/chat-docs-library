import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'

import { MongoDBAtlasVectorSearch } from '@langchain/community/vectorstores/mongodb_atlas'
import { MongoClient } from 'mongodb'

import { ChatPromptTemplate } from '@langchain/core/prompts'
import { MessagesPlaceholder } from '@langchain/core/prompts'
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { HumanMessage, AIMessage } from '@langchain/core/messages'

import { NextResponse } from 'next/server'

import prisma from '@/lib/database/prisma'
import { streamAndSaveMessage } from '@/utils/chatPage'

export async function POST(req, res) {
	let { messages, anonymousId } = await req.json()
	const userId = '65a6d70c998834f0dafc8786'

	//conversation Id is being called anoyomousId on frontend.
	let conversationId = anonymousId

	let userQuestion = messages[messages.length - 1].content

	if (!userQuestion) {
		return NextResponse.json(
			{
				message: 'Please provide the user question',
			},
			{ status: 400 }
		)
	}

	// This is the id of the conversation model in the database. It is being used to identify the chat history of the user wrt to same conversation.
	let conversationModelId

	if (conversationId) {
		const prevConversation = await prisma.Conversation.findUnique({
			where: {
				conversationId: conversationId,
			},
		})
		console.log(prevConversation)
		if (!prevConversation) {
			const newConversation = await prisma.Conversation.create({
				data: {
					title: userQuestion.slice(0, 20),
					userId: userId,
					chatDocsCollectionName: 'NextJs',
					conversationId: conversationId,
				},
			})
			conversationModelId = newConversation.id
		} else {
			conversationModelId = prevConversation.id
		}
	} else { return NextResponse.json({ message: 'Please provide the conversationId' }, { status: 400 }) }

	const chatModel = new ChatOpenAI({
		temperature: 0,
		streaming: true,
	})

	const client = new MongoClient(process.env.DATABASE_URL)
	const collection = client.db('chat-docs-library').collection('NextJs')

	const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), {
		collection,
		// You're index name should be same as you've passed in train/route.js
		indexName: 'default', // The name of the Atlas search index. Defaults to "default"
	})
	const retriever = vectorStore.asRetriever()

	const historyAwarePrompt = ChatPromptTemplate.fromMessages([
		new MessagesPlaceholder('chat_history'),
		['user', '{input}'],
		[
			'user',
			'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation',
		],
	])

	const historyAwareRetrieverChain = await createHistoryAwareRetriever({
		llm: chatModel,
		retriever,
		rephrasePrompt: historyAwarePrompt,
	})

	const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
		['system', "Answer the user's questions based on the below context:\n\n{context}"],
		new MessagesPlaceholder('chat_history'),
		['user', '{input}'],
	])

	const historyAwareCombineDocsChain = await createStuffDocumentsChain({
		llm: chatModel,
		prompt: historyAwareRetrievalPrompt,
	})

	const conversationalRetrievalChain = await createRetrievalChain({
		retriever: historyAwareRetrieverChain,
		combineDocsChain: historyAwareCombineDocsChain,
	})

	let chatHistory = []
	const messageWithoutLastUserQuestion = messages.slice(0, messages.length - 1)

	messageWithoutLastUserQuestion.forEach(mssg => {
		mssg.role === 'user'
			? chatHistory.push(new HumanMessage(mssg.content))
			: chatHistory.push(new AIMessage(mssg.content))
	})

	const result = await conversationalRetrievalChain.stream({
		chat_history: chatHistory,
		input: userQuestion,
	})

	const streamedResult = await streamAndSaveMessage(
		result,
		conversationId,
		conversationModelId,
		userQuestion,
		client
	)

	return new Response(streamedResult)
}
