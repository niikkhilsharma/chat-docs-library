For use with `@next/mdx`. Compile MDX files using the new Rust compiler.

\`\`\`js filename="next.config.js" const withMDX =
require('@next/mdx')()

/\*\* @type {import('next').NextConfig} \*/ const nextConfig = {
pageExtensions: \['ts', 'tsx', 'mdx'\], experimental: { mdxRs: true, },
}

module.exports = withMDX(nextConfig) \`\`\`
