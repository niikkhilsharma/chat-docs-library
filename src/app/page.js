import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

export default function Home() {
	return (
		<main className="h-screen flex justify-center items-center">
			<div className="text-center">
				<h1 className="my-2">Chat with the latest Next Js 14 documentation.</h1>
				<Link href={'/chat/nextjs'} className={buttonVariants({ variant: 'outline' })}>
					Chat with Nextjs
				</Link>
			</div>
		</main>
	)
}
