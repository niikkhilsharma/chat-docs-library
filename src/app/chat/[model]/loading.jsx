import { Skeleton } from '@/components/ui/skeleton'

export default async function ChatLoader() {
	return (
		<div className="p-6 flex h-screen space-x-4">
			<Skeleton className="w-1/4 p-6">
				<Skeleton className="w-full h-32 bg-blue-100" />
				<div className="mt-20 space-y-4">
					<Skeleton className="w-full h-8 bg-gray-300" />
					<Skeleton className="w-full h-8 bg-gray-300" />
					<Skeleton className="w-full h-8 bg-gray-300" />
					<Skeleton className="w-full h-8 bg-gray-300" />
					<Skeleton className="w-full h-8 bg-gray-300" />
					<Skeleton className="w-full h-8 bg-gray-300" />
					<Skeleton className="w-full h-8 bg-gray-300" />
					<Skeleton className="w-full h-8 bg-gray-300" />
				</div>
			</Skeleton>
			<Skeleton className="w-full flex flex-col p-6">
				<div className="space-y-10">
					<Skeleton className="w-3/5 h-8 bg-gray-300 mr-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-300 ml-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-300 mr-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-300 ml-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-300 mr-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-300 ml-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-300 mr-auto" />
				</div>

				<Skeleton className="w-full mt-auto mx-auto h-8 bg-gray-300" />
			</Skeleton>
		</div>
	)
}
