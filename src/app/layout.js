import { Analytics } from '@vercel/analytics/react'

import { Inter } from 'next/font/google'
import './globals.css'

import { NextAuthProvider } from '@/lib/auth/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

import { ThemeProvider } from '@/utils/frontend/theme-provider'

export const metadata = {
	title: 'Chat Docs Library',
	description:
		'Revolutionize tech learning with conversation! Say farewell to static docs—our AI-powered platform guides you through tech info effortlessly. Join the conversation now!',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} max-w-screen-2xl`}>
				<NextAuthProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						{children}
					</ThemeProvider>
				</NextAuthProvider>
				{/* <Analytics /> */}
			</body>
		</html>
	)
}
