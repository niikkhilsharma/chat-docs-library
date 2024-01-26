import { StreamingTextResponse } from 'ai'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth/auth'

export const runtime = 'edge'

export async function POST(req, res) {
	let { messages, anonymousId } = await req.json()

	// const session = await getServerSession(authOptions)
	const userId = '65a6d70c998834f0dafc8786'

	const response = await fetch('http://localhost:3000/api/docs/nextjs/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ messages, anonymousId, userId }),
	})

	return new StreamingTextResponse(response.arrayBuffer())
}
