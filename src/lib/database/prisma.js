import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

let prisma

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient().$extends(withAccelerate())
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient()
	}
	prisma = global.prisma
}

export default prisma
