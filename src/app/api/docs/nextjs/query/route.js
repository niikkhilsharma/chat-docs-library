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

export async function POST(req) {
	let { conversationTitle, userQuestion, conversationId } = await req.json()
	const userId = '65a6d70c998834f0dafc8786'

	if (!userQuestion) {
		return NextResponse.json(
			{
				message: 'Please provide the user question',
			},
			{ status: 400 }
		)
	}

	if (!conversationTitle) {
		conversationTitle = userQuestion.slice(0, 10)
	}

	const chatModel = new ChatOpenAI({ temperature: 0, streaming: true })

	const client = new MongoClient(process.env.DATABASE_URL)
	const dbName = 'chat-docs-library'
	const collectionName = 'NextJs'
	const collection = client.db(dbName).collection(collectionName)

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
	let isConversationExists = false

	if (conversationId) {
		const validConversationId = await prisma.Conversation.findUnique({
			where: {
				id: conversationId,
			},
		})
		if (validConversationId) {
			isConversationExists = true

			const conversationMessages = await prisma.Message.findMany({
				where: {
					conversationId: conversationId,
				},
			})
			console.log(conversationMessages)

			conversationMessages.forEach(mssg => {
				chatHistory.push(new HumanMessage(mssg.humanMessage))
				chatHistory.push(new AIMessage(mssg.aiMessage))
			})
		}
	}

	const result = await conversationalRetrievalChain.invoke({
		chat_history: chatHistory,
		input: userQuestion,
	})

	if (isConversationExists) {
		const newMessage = await prisma.Message.create({
			data: {
				conversationId: conversationId,
				humanMessage: userQuestion,
				aiMessage: result.answer,
			},
		})
		console.log(newMessage)
	} else {
		const newConversation = await prisma.Conversation.create({
			data: {
				title: conversationTitle,
				userId: userId,
				chatDocsCollectionName: 'NextJs',
				messages: {
					create: [
						{
							humanMessage: userQuestion,
							aiMessage: result.answer,
						},
					],
				},
			},
		})

		conversationId = newConversation.id
	}

	await prisma.$disconnect()
	await client.close()

	return NextResponse.json({
		conversationId: conversationId,
		conversationTitle: conversationTitle,
		answer: result.answer,
	})
}
