import Link from 'next/link'

export default function Home() {
	return (
		<main className="h-screen flex justify-center items-center">
			<div className="text-center">
				<h1>Welcome to the Home Page</h1>
				<Link href={'/chat/nextjs'} className="text-blue-400">
					Chat with Nextjs
				</Link>
			</div>
		</main>
	)
}
