'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'

function generateUniqueNumber() {
	const timestamp = new Date().getTime()
	const randomPart = Math.floor(Math.random() * 1000000)
	const uniqueNumber = `${timestamp}${randomPart}`.slice(0, 12)

	return uniqueNumber
}

export default function Home() {
	const [conversationId, setConversationId] = useState(generateUniqueNumber())
	// console.log(conversationId)

	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: '/api/docs/nextjs/query',
		body: {
			anonymousId: conversationId,
		},
	})

	return (
		<div className="px-10">
			<h1 className="text-center my-10 font-bold text-xl">Trained Over Nextjs 14 Docs</h1>
			<div>
				{messages.map(m => (
					<div key={m.id}>
						<span className="font-bold">{m.role}</span>: {m.content}
					</div>
				))}

				<form onSubmit={handleSubmit}>
					<input
						value={input}
						placeholder="Say something..."
						onChange={handleInputChange}
					/>
				</form>
			</div>
		</div>
	)
}
