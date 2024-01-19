import { MongoDBAtlasVectorSearch } from '@langchain/community/vectorstores/mongodb_atlas'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MongoClient } from 'mongodb'

import { NextResponse } from 'next/server'

export async function GET() {
	const client = new MongoClient(process.env.DATABASE_URL)

	const dbName = 'chat-docs-library'
	const collectionName = 'NextJs'
	const collection = client.db(dbName).collection(collectionName)

	const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), {
		collection,
		// You're index name should be same as you've passed in train/route.js
		indexName: 'default', // The name of the Atlas search index. Defaults to "default"
	})

	const resultOne = await vectorStore.similaritySearch(
		'please write a code example for using Using the useRouter',
		5
	)

	const allReponseString = resultOne.map(item => item.pageContent)

	await client.close()

	return NextResponse.json({ message: 'hello', allReponseString })
}
