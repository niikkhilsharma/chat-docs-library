import prisma from '@/lib/database/prisma'
import { NextResponse } from 'next/server'
const encoder = new TextEncoder()

function iteratorToStream(iterator) {
	return new ReadableStream({
		async pull(controller) {
			const { value, done } = await iterator.next()
			if (done) {
				controller.close()
			} else {
				controller.enqueue(value)
			}
		},
	})
}

async function* makeIterator(result, conversationId, conversationModelId, userQuestion, client) {
	let aiMessage = ''
	for await (const chunk of result) {
		if (chunk.answer) {
			const answer = chunk.answer
			aiMessage += answer
			yield encoder.encode(answer)
		}
	}
	console.log('aiMessage', aiMessage)

	client.close()

	try {
		const res = fetch('http://localhost:3000/api/docs/nextjs/saveMsg', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ conversationId, conversationModelId, humanMessage: userQuestion, aiMessage }),
		})
	} catch (error) {
		return NextResponse.json({ message: 'Error saving message' }, { status: 500 })
	}

	// saveMessage(conversationId, conversationModelId, userQuestion, aiMessage, client)
}

export async function streamAndSaveMessage(result, conversationId, conversationModelId, userQuestion, client) {
	const iterator = makeIterator(result, conversationId, conversationModelId, userQuestion, client)
	const stream = iteratorToStream(iterator)
	return stream
}

// async function saveMessage(conversationId, conversationModelId, humanMessage = userQuestion, aiMessage, client) {
// 	const newMessage = await prisma.Message.create({
// 		data: { conversationId: conversationId, conversationModelId: conversationModelId, humanMessage, aiMessage },
// 	})
// 	await client.close()

// 	return { conversationId }
// }
