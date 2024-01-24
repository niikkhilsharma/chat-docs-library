export function generateUniqueNumber() {
	const timestamp = new Date().getTime()
	const randomPart = Math.floor(Math.random() * 1000000)
	const uniqueNumber = `${timestamp}${randomPart}`.slice(0, 12)

	return uniqueNumber
}
