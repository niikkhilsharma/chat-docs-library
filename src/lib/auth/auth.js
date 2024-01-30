import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from '../database/prisma'

export const authOptions = {
	pages: { signIn: '/auth/login' },
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt',
	},
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_APP_CLIENT_ID,
			clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],

	callbacks: {
		async jwt({ token }) {
			const dbUser = await prisma.user.findUnique({
				where: {
					email: token.email,
				},
			})

			token.isAdmin = Boolean(dbUser?.isAdmin)
			token.id = dbUser?.id

			return token
		},
		async session({ session, token, user }) {
			session.user.id = token.id
			session.user.isAdmin = token.isAdmin
			// console.log(session)
			return session
		},
	},
}
