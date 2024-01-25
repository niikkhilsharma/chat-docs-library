import prisma from '@/lib/database/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
	const { conversationId, conversationModelId, humanMessage, aiMessage } = await req.json()
	const newMessage = await prisma.Message.create({
		data: { conversationId: conversationId, conversationModelId: conversationModelId, humanMessage, aiMessage },
	})
	console.log(newMessage)
	return NextResponse.json({ message: 'Message saved' }, { status: 200 })
}
