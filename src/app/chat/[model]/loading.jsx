import { Skeleton } from '@/components/ui/skeleton'

export default async function ChatLoader() {
	return (
		<div className="px-2 py-4 md:p-6 flex h-screen">
			<Skeleton className="hidden w-1/4 p-6 md:block mr-4">
				<Skeleton className="w-full h-32 bg-gray-200" />
				<div className="mt-20 space-y-4">
					<Skeleton className="w-full h-8 bg-gray-200" />
					<Skeleton className="w-full h-8 bg-gray-200" />
					<Skeleton className="w-full h-8 bg-gray-200" />
					<Skeleton className="w-full h-8 bg-gray-200" />
					<Skeleton className="w-full h-8 bg-gray-200" />
					<Skeleton className="w-full h-8 bg-gray-200" />
					<Skeleton className="w-full h-8 bg-gray-200" />
					<Skeleton className="w-full h-8 bg-gray-200" />
				</div>
			</Skeleton>
			<Skeleton className="w-full flex flex-col p-6 m-0">
				<div className="space-y-10">
					<Skeleton className="w-3/5 h-8 bg-gray-200 mr-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-200 ml-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-200 mr-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-200 ml-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-200 mr-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-200 ml-auto" />
					<Skeleton className="w-3/5 h-8 bg-gray-200 mr-auto" />
				</div>

				<Skeleton className="w-full mt-auto mx-auto h-8 bg-gray-200" />
			</Skeleton>
		</div>
	)
}
