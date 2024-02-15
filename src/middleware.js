export { default } from 'next-auth/middleware'

export const config = {
	// matcher: '/((?!api/auth|auth|images|_next/static|_next/image|favicon.ico|^/$).+)',
	matcher: '/((?!api/auth/[^/]+$|auth|api/auth|images|_next/static|_next/image|favicon.ico|^/$).+)',
}
