/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'avatars3.githubusercontent.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'picsum.photos',
				pathname: '**',
			},
		],
	},
}

module.exports = nextConfig
