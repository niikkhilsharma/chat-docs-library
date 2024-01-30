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
import { streamAndSaveMessage } from '@/utils/backend/chatPage'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { StreamingTextResponse } from 'ai'

export async function POST(req, res) {
	let { messages, conversationId } = await req.json()

	const session = await getServerSession(authOptions)
	const userId = session.user.id

	let userQuestion = messages[messages.length - 1].content

	if (!userQuestion) {
		return NextResponse.json(
			{
				message: 'Please provide the user question',
			},
			{ status: 400 }
		)
	}

	// This is the id of the conversation model/object in the database. It is being used to identify the chat history of the user wrt to same conversation.
	let conversationModelId

	if (conversationId) {
		const prevConversation = await prisma.Conversation.findUnique({
			where: {
				conversationId: conversationId,
			},
		})

		if (!prevConversation) {
			const newConversation = await prisma.Conversation.create({
				data: {
					title: userQuestion.slice(0, 20),
					userId: userId,
					modelName: 'NextJs',
					conversationId: conversationId,
				},
			})
			conversationModelId = newConversation.id
		} else {
			conversationModelId = prevConversation.id
		}
	} else {
		return NextResponse.json({ message: 'Please provide the conversationId' }, { status: 400 })
	}

	const chatModel = new ChatOpenAI({
		temperature: 0,
		streaming: true,
	})

	const client = new MongoClient(process.env.DB_URL)
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
		[
			'system',
			"You're a chatbot trained over Nextjs 14 documentation. You're task is to provided answer to the input on that basis of the context provided only. Make sure to answer from the context below only. Note if you don't know answer to any question just say 'I don't know' but don't try to make up an answer. context:\n\n{context}",
		],
		['system', 'The latest nextjs version in the market is 14.0.2'],
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

	const streamedResult = await streamAndSaveMessage(result, conversationId, conversationModelId, userQuestion, client)

	return new StreamingTextResponse(streamedResult)
}
