// This would be useeful when we will fetch conversation based on the conversationId

// if (conversationId) {
// 	const validConversationId = await prisma.Conversation.findUnique({
// 		where: {
// 			id: conversationId,
// 		},
// 	})
// 	if (validConversationId) {
// 		isConversationExists = true

// 		const conversationMessages = await prisma.Message.findMany({
// 			where: {
// 				conversationId: conversationId,
// 			},
// 		})

// 		conversationMessages.forEach(mssg => {
// 			chatHistory.push(new HumanMessage(mssg.humanMessage))
// 			chatHistory.push(new AIMessage(mssg.aiMessage))
// 		})
// 	}
// }
