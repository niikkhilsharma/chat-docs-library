/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['lh3.googleusercontent.com', 'avatars3.githubusercontent.com'],
	},
	httpAgentOptions: {
		keepAlive: true,
	},
}

module.exports = nextConfig
