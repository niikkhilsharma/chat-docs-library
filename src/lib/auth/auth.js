import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from '../database/prisma'

export const authOptions = {
	adapter: PrismaAdapter(prisma),

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
		async session({ session, token, user }) {
			session.user.id = user.id
			return session
		},
	},
}
