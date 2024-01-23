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
import { redirect } from 'next/navigation'

import prisma from '@/lib/database/prisma'
import { streamAndSaveMessage } from '@/utils/chatPage'
import { cookies } from 'next/headers'

export async function POST(req, res) {
	let { messages } = await req.json()
	const userId = '65a6d70c998834f0dafc8786'

	const cookieStore = cookies()
	let conversationId = cookieStore.get('conversationId')
	console.log(conversationId)

	conversationId ? (conversationId = conversationId.value) : null
	console.log(conversationId)

	let userQuestion = messages[messages.length - 1].content
	if (!userQuestion) {
		return NextResponse.json(
			{
				message: 'Please provide the user question',
			},
			{ status: 400 }
		)
	}

	if (conversationId) {
		const prevConversation = await prisma.Conversation.findUnique({
			where: {
				id: conversationId,
			},
		})
		if (!prevConversation) {
			console.log('running this')
			cookieStore.delete('conversationId')
			return redirect('https://nextjs.org/')
		}
	} else {
		const newConversation = await prisma.Conversation.create({
			data: {
				title: userQuestion.slice(0, 20),
				userId: userId,
				chatDocsCollectionName: 'NextJs',
			},
		})
		conversationId = newConversation.id
	}

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
		userQuestion,
		client
	)

	// await client.close()

	cookies().set('conversationId', conversationId)
	return new Response(streamedResult)

	// return NextResponse.json({
	// 	conversationId: conversationId,
	// })
}
