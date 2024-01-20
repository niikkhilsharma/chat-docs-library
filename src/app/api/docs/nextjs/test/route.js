import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'

import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import { MessagesPlaceholder } from '@langchain/core/prompts'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		message:
			'This was originally made to practise the langchain docs. And use the knowledge along with mongodb file query/route.js to make a chatbot for langchain docs.',
	})
	const chatModel = new ChatOpenAI({})
	const splitter = new RecursiveCharacterTextSplitter()
	const embeddings = new OpenAIEmbeddings()

	// const prompt = ChatPromptTemplate.fromMessages([
	// 	['system', 'You are a world class technical documentation writer.'],
	// 	['user', '{input}'],
	// ])
	// const llmChain = prompt.pipe(chatModel).pipe(outputParser)
	// await llmChain.invoke({
	// 	input: 'what is LangSmith?',
	// })

	const loader = new CheerioWebBaseLoader('https://docs.smith.langchain.com/overview')
	const docs = await loader.load()
	const splitDocs = await splitter.splitDocuments(docs)

	const vectorstore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)
	const retriever = vectorstore.asRetriever()

	// Beginning of retrieval chain
	// 	const prompt =
	// 		ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

	// <context>
	// {context}
	// </context>

	// Question: {input}`)

	// const documentChain = await createStuffDocumentsChain({
	// 	llm: chatModel,
	// 	prompt,
	// })
	// const retrievalChain = await createRetrievalChain({
	// 	combineDocsChain: documentChain,
	// 	retriever,
	// })

	// const result = await retrievalChain.invoke({
	// 	input: 'what is LangSmith?',
	// })
	// console.log(result.answer)

	// Beginning of history aware retrieval chain
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
	// const chatHistory = [
	// 	new HumanMessage('Can LangSmith help test my LLM applications?'),
	// 	new AIMessage('Yes!'),
	// ]
	// const docsGeneratedBySearchQuery = await historyAwareRetrieverChain.invoke({
	// 	chat_history: chatHistory,
	// 	input: 'Tell me how!',
	// })

	// Making another chain to get the answer on the basis of docs retrieved by the search query
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
	const result2 = await conversationalRetrievalChain.invoke({
		chat_history: [
			new HumanMessage('Can LangSmith help test my LLM applications?'),
			new AIMessage('Yes!'),
		],
		input: 'tell me how',
	})

	return NextResponse.json({ message: 'hello', answer: result2.answer })
}
