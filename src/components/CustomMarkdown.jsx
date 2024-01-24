import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

const CustomMarkdown = ({ content }) => {
	return (
		<ReactMarkdown
			components={{
				code({ node, inline, className, children, ...props }) {
					const match = /language-(\w+)/.exec(className || '')
					const isTerminal = className === 'language-terminal'

					return !inline && match ? (
						<SyntaxHighlighter
							// children={String(children).replace(/\n$/, '')}
							style={isTerminal ? { background: '#000', color: '#FFF', padding: '8px', borderRadius: '4px' } : materialDark}
							PreTag="div"
							language={match[1]}
							{...props}
						>
							{String(children).replace(/\n$/, '')}
						</SyntaxHighlighter>
					) : (
						<code className={className} {...props}>
							{children}
						</code>
					)
				},
				p({ node, children, ...props }) {
					return (
						<p style={{ marginBottom: '1em' }} {...props}>
							{children}
						</p>
					)
				},
			}}
			remarkPlugins={[remarkGfm]}
		>
			{content}
		</ReactMarkdown>
	)
}

export default CustomMarkdown
