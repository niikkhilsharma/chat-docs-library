import prisma from '@/lib/database/prisma'
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

async function* makeIterator(result, conversationId, userQuestion, client) {
	let aiMessage = ''
	for await (const chunk of result) {
		if (chunk.answer) {
			const answer = chunk.answer
			aiMessage += answer
			yield encoder.encode(answer)
		}
	}
	console.log(aiMessage)
	saveMessage(conversationId, userQuestion, aiMessage, client)
}

export async function streamAndSaveMessage(
	result,
	conversationId,
	userQuestion,
	client
) {
	const iterator = makeIterator(result, conversationId, userQuestion, client)
	const stream = iteratorToStream(iterator)
	return stream
}

async function saveMessage(
	conversationId,
	humanMessage = userQuestion,
	aiMessage,
	client
) {
	const newMessage = await prisma.Message.create({
		data: {
			conversationId,
			humanMessage,
			aiMessage,
		},
	})
	console.log(newMessage)

	await client.close()
	return { conversationId }
}
