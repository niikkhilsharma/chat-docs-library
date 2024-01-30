import * as React from 'react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import AuthBtn from '@/components/AuthBtn'
import Image from 'next/image'

export default async function Login({ searchParams }) {
	return (
		<div className="flex h-screen">
			<div className="hidden md:block md:w-1/2">
				<Image src="/images/loginImg.jpeg" alt="botImage" width={1024} height={1024} className="h-full" priority />
			</div>
			<div className="w-full md:w-1/2 flex justify-center items-center px-6">
				<Card className="w-[350px]">
					<CardHeader className="text-center">
						<CardTitle>Login</CardTitle>
						<CardDescription>Login with your favourite provier with just one click.</CardDescription>
					</CardHeader>
					<CardContent>
						<AuthBtn callbackUrl={searchParams.callbackUrl} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
