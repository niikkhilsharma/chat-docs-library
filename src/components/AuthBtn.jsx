'use client'

import React from 'react'

import { FaGoogle } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'

import { Button } from './ui/button'

import { signIn } from 'next-auth/react'

const AuthBtn = ({ callbackUrl }) => {
	return (
		<div className="flex justify-between items-center">
			<Button onClick={() => signIn('google', { callbackUrl: callbackUrl ?? '/' })}>
				<FaGoogle className="mr-2" />
				Google SignIn
			</Button>
			<Button onClick={() => signIn('github', { callbackUrl: callbackUrl ?? '/' })}>
				<FaGithub className="mr-2" />
				Github SignIn
			</Button>
		</div>
	)
}

export default AuthBtn
