'use client'

import { useChat } from 'ai/react'

export default function Home() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: '/api/docs/nextjs/query',
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
