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
	const retriever = vectorStore.asRetriever({ k: 7 })
	const historyAwarePrompt = ChatPromptTemplate.fromMessages([
		new MessagesPlaceholder('chat_history'),
		['user', '{input}'],
		['user', 'From the input given generate a search query to look for the answer in the Nextjs 14 documentation.'],
	])

	const historyAwareRetrieverChain = await createHistoryAwareRetriever({
		llm: chatModel,
		retriever,
		rephrasePrompt: historyAwarePrompt,
	})

	const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
		[
			'system',
			'The latest nextjs documentation is released with the latest version 14.0.2. I will provide you with a question based on nextjs and also provide you some context related to that question, and that context will contain the answer to the question. You have to take the context and answer the question on the basis of the context. It is strictly advised not to make up your own answer if you think the context is not enough to answer the question. If you don’t know the answer, just say “I don’t know”. And if the context is insufficient you can say provide more context. And also write code sample when ever possible. Make sure that you read the context and try to learn from it as the new Nextjs update consis of a lot many new things. Everything provided in context is correct and you have to write the answer after learning from it only. Try to copy the whole context. Exacly copy the import path from the context do not take any previous or you own import routes. Context= {context}',
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
