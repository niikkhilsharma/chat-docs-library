import { MongoDBAtlasVectorSearch } from '@langchain/community/vectorstores/mongodb_atlas'
import { NotionLoader } from 'langchain/document_loaders/fs/notion'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { MongoClient } from 'mongodb'

import { NextResponse } from 'next/server'
import path from 'path'

import prisma from '@/lib/database/prisma'

export async function GET() {
	return NextResponse.json({
		message:
			"You've already trained the chatbot please remove the return line to re-train it. And also remember database already has the trained embeddings and if you'll re-train it without deleting the previous embeddings then it will create same double embeddings. So please delete the previous embeddings from the database. And also delete the details from the embeddingList collection.",
	})
	const client = new MongoClient(process.env.DATABASE_URL || '')

	const dbName = 'chat-docs-library'
	const collectionName = 'NextJs'
	const collection = client.db(dbName).collection(collectionName)

	const pathToDocs = path.join(process.cwd(), 'public/docs/NextJs')
	const loader = new NotionLoader(pathToDocs)
	const docs = await loader.load()

	const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
		chunkSize: 1000,
		chunkOverlap: 50,
	})
	const splitDocs = await splitter.splitDocuments(docs)

	const vectorstore = await MongoDBAtlasVectorSearch.fromDocuments(
		splitDocs,
		new OpenAIEmbeddings({ maxConcurrency: 1, maxRetries: 10 }),
		{
			collection,
			indexName: 'default', // The name of the Atlas search index. Defaults to "default"
		}
	)

	await prisma.EmbeddingsList.create({
		data: {
			title: 'NextJs Docs',
			description:
				'These are the embeddings made using the nextjs documentation. Which I converted to md format. And all the embedding of nextjs docs are stored in the collection named NextJs',
			// This is the name of the collection in which the embeddings are stored
			collectionName,
			source: pathToDocs,
		},
	})

	await client.close()

	return NextResponse.json({ message: 'hello', vectorstore })
}
