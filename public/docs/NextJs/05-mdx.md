{/\* The content of this doc is shared between the app and pages router.
You can use the `<PagesOnly>Content</PagesOnly>` component to add
content that is specific to the Pages Router. Any shared content should
not be wrapped in a component. \*/}

[Markdown](https://daringfireball.net/projects/markdown/syntax) is a
lightweight markup language used to format text. It allows you to write
using plain text syntax and convert it to structurally valid HTML. It's
commonly used for writing content on websites and blogs.

You write...

``` md
I **love** using [Next.js](https://nextjs.org/)
```

Output:

``` html
<p>I <strong>love</strong> using <a href="https://nextjs.org/">Next.js</a></p>
```

[MDX](https://mdxjs.com/) is a superset of markdown that lets you write
[JSX](https://react.dev/learn/writing-markup-with-jsx) directly in your
markdown files. It is a powerful way to add dynamic interactivity and
embed React components within your content.

Next.js can support both local MDX content inside your application, as
well as remote MDX files fetched dynamically on the server. The Next.js
plugin handles transforming markdown and React components into HTML,
including support for usage in Server Components (the default in App
Router).

## `@next/mdx`

The `@next/mdx` package is used to configure Next.js so it can process
markdown and MDX. **It sources data from local files**, allowing you to
create pages with a `.mdx` extension, directly in your `/pages` or
`/app` directory.

Let's walk through how to configure and use MDX with Next.js.

## Getting Started

Install packages needed to render MDX:

`bash filename="Terminal" npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx`

`<AppOnly>`{=html}

Create a `mdx-components.tsx` file at the root of your application
(`src/` or the parent folder of `app/`):

> **Good to know**: `mdx-components.tsx` is required to use MDX with App
> Router and will not work without it.

\`\`\`tsx filename="mdx-components.tsx" switcher import type {
MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents):
MDXComponents { return { ...components, } }


    ```js filename="mdx-components.js" switcher
    export function useMDXComponents(components) {
      return {
        ...components,
      }
    }

`</AppOnly>`{=html}

Update the `next.config.js` file at your project's root to configure it
to use MDX:

\`\`\`js filename="next.config.js" const withMDX =
require('@next/mdx')()

/\*\* @type {import('next').NextConfig} \*/ const nextConfig = { //
Configure `pageExtensions` to include MDX files pageExtensions: \['js',
'jsx', 'mdx', 'ts', 'tsx'\], // Optionally, add any other Next.js config
below }

module.exports = withMDX(nextConfig)


    <AppOnly>

    Then, create a new MDX page within the `/app` directory:

    ```txt
      your-project
      ├── app
      │   └── my-mdx-page
      │       └── page.mdx
      └── package.json

`</AppOnly>`{=html}

`<PagesOnly>`{=html}

Then, create a new MDX page within the `/pages` directory:

``` txt
  your-project
  ├── pages
  │   └── my-mdx-page.mdx
  └── package.json
```

`</PagesOnly>`{=html}

Now you can use markdown and import React components directly inside
your MDX page:

``` mdx
import { MyComponent } from 'my-components'

# Welcome to my MDX page!

This is some **bold** and _italics_ text.

This is a list in markdown:

- One
- Two
- Three

Checkout my React component:

<MyComponent />
```

Navigating to the `/my-mdx-page` route should display your rendered MDX.

## Remote MDX

If your markdown or MDX files or content lives *somewhere else*, you can
fetch it dynamically on the server. This is useful for content stored in
a separate local folder, CMS, database, or anywhere else. A popular
community package for this use is
[`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote#react-server-components-rsc--nextjs-app-directory-support).

> **Good to know**: Please proceed with caution. MDX compiles to
> JavaScript and is executed on the server. You should only fetch MDX
> content from a trusted source, otherwise this can lead to remote code
> execution (RCE).

The following example uses `next-mdx-remote`:

`<AppOnly>`{=html}

\`\`\`tsx filename="app/my-mdx-page-remote/page.tsx" switcher import {
MDXRemote } from 'next-mdx-remote/rsc'

export default async function RemoteMdxPage() { // MDX text - can be
from a local file, database, CMS, fetch, anywhere... const res = await
fetch('https://...') const markdown = await res.text() return
`<MDXRemote source={markdown} />`{=html} }


    ```jsx filename="app/my-mdx-page-remote/page.js" switcher
    import { MDXRemote } from 'next-mdx-remote/rsc'

    export default async function RemoteMdxPage() {
      // MDX text - can be from a local file, database, CMS, fetch, anywhere...
      const res = await fetch('https://...')
      const markdown = await res.text()
      return <MDXRemote source={markdown} />
    }

`</AppOnly>`{=html}

`<PagesOnly>`{=html}

\`\`\`tsx filename="pages/my-mdx-page-remote.tsx" switcher import {
serialize } from 'next-mdx-remote/serialize' import { MDXRemote,
MDXRemoteSerializeResult } from 'next-mdx-remote'

interface Props { mdxSource: MDXRemoteSerializeResult }

export default function RemoteMdxPage({ mdxSource }: Props) { return
\<MDXRemote {...mdxSource} /\> }

export async function getStaticProps() { // MDX text - can be from a
local file, database, CMS, fetch, anywhere... const res = await
fetch('https:...') const mdxText = await res.text() const mdxSource =
await serialize(mdxText) return { props: { mdxSource } } }


    ```jsx filename="pages/my-mdx-page-remote.js" switcher
    import { serialize } from 'next-mdx-remote/serialize'
    import { MDXRemote } from 'next-mdx-remote'

    export default function RemoteMdxPage({ mdxSource }) {
      return <MDXRemote {...mdxSource} />
    }

    export async function getStaticProps() {
      // MDX text - can be from a local file, database, CMS, fetch, anywhere...
      const res = await fetch('https:...')
      const mdxText = await res.text()
      const mdxSource = await serialize(mdxText)
      return { props: { mdxSource } }
    }

`</PagesOnly>`{=html}

Navigating to the `/my-mdx-page-remote` route should display your
rendered MDX.

## Layouts

`<AppOnly>`{=html}

To share a layout amongst MDX pages, you can use the [built-in layouts
support](/docs/app/building-your-application/routing/pages-and-layouts#layouts)
with the App Router.

`tsx filename="app/my-mdx-page/layout.tsx" switcher export default function MdxLayout({ children }: { children: React.ReactNode }) {   // Create any shared layout or styles here   return <div style={{ color: 'blue' }}>{children}</div> }`

`jsx filename="app/my-mdx-page/layout.js" switcher export default function MdxLayout({ children }) {   // Create any shared layout or styles here   return <div style={{ color: 'blue' }}>{children}</div> }`

`</AppOnly>`{=html}

`<PagesOnly>`{=html}

To share a layout around MDX pages, create a layout component:

`tsx filename="components/mdx-layout.tsx" switcher export default function MdxLayout({ children }: { children: React.ReactNode }) {   // Create any shared layout or styles here   return <div style={{ color: 'blue' }}>{children}</div> }`

`jsx filename="components/mdx-layout.js" switcher export default function MdxLayout({ children }) {   // Create any shared layout or styles here   return <div style={{ color: 'blue' }}>{children}</div> }`

Then, import the layout component into the MDX page, wrap the MDX
content in the layout, and export it:

``` mdx
import MdxLayout from '../components/mdx-layout'

# Welcome to my MDX page!

export default function MDXPage({ children }) {
  return <MdxLayout>{children}</MdxLayout>;

}
```

`</PagesOnly>`{=html}

## Remark and Rehype Plugins

You can optionally provide `remark` and `rehype` plugins to transform
the MDX content.

For example, you can use `remark-gfm` to support GitHub Flavored
Markdown.

Since the `remark` and `rehype` ecosystem is ESM only, you'll need to
use `next.config.mjs` as the configuration file.

\`\`\`js filename="next.config.mjs" import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/\*\* @type {import('next').NextConfig} \*/ const nextConfig = { //
Configure \`pageExtensions\`\` to include MDX files pageExtensions:
\['js', 'jsx', 'mdx', 'ts', 'tsx'\], // Optionally, add any other
Next.js config below }

const withMDX = createMDX({ // Add markdown plugins here, as desired
options: { remarkPlugins: \[remarkGfm\], rehypePlugins: \[\], }, })

// Merge MDX config with Next.js config export default
withMDX(nextConfig)


    ## Frontmatter

    Frontmatter is a YAML like key/value pairing that can be used to store data about a page. `@next/mdx` does **not** support frontmatter by default, though there are many solutions for adding frontmatter to your MDX content, such as:

    - [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter)
    - [remark-mdx-frontmatter](https://github.com/remcohaszing/remark-mdx-frontmatter)
    - [gray-matter](https://github.com/jonschlinkert/gray-matter).

    To access page metadata with `@next/mdx`, you can export a metadata object from within the `.mdx` file:

    ```mdx
    export const metadata = {
      author: 'John Doe',
    }

    # My MDX page

## Custom Elements

One of the pleasant aspects of using markdown, is that it maps to native
`HTML` elements, making writing fast, and intuitive:

``` md
This is a list in markdown:

- One
- Two
- Three
```

The above generates the following `HTML`:

``` html
<p>This is a list in markdown:</p>

<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

When you want to style your own elements for a custom feel to your
website or application, you can pass in shortcodes. These are your own
custom components that map to `HTML` elements.

`<AppOnly>`{=html}

To do this, open the `mdx-components.tsx` file at the root of your
application and add custom elements:

`</AppOnly>`{=html}

`<PagesOnly>`{=html}

To do this, create a `mdx-components.tsx` file at the root of your
application (the parent folder of `pages/` or `src/`) and add custom
elements:

`</PagesOnly>`{=html}

\`\`\`tsx filename="mdx-components.tsx" switcher import type {
MDXComponents } from 'mdx/types' import Image, { ImageProps } from
'next/image'

// This file allows you to provide custom React components // to be used
in MDX files. You can import and use any // React component you want,
including inline styles, // components from other libraries, and more.

export function useMDXComponents(components: MDXComponents):
MDXComponents { return { // Allows customizing built-in components,
e.g. to add styling. h1: ({ children }) =\> \<h1 style={{ fontSize:
'100px' }}\>{children}
```{=html}
</h1>
```
, img: (props) =\> ( \<Image sizes="100vw" style={{ width: '100%',
height: 'auto' }} {...(props as ImageProps)} /\> ), ...components, } }


    ```js filename="mdx-components.js" switcher
    import Image from 'next/image'

    // This file allows you to provide custom React components
    // to be used in MDX files. You can import and use any
    // React component you want, including inline styles,
    // components from other libraries, and more.

    export function useMDXComponents(components) {
      return {
        // Allows customizing built-in components, e.g. to add styling.
        h1: ({ children }) => <h1 style={{ fontSize: '100px' }}>{children}</h1>,
        img: (props) => (
          <Image
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            {...props}
          />
        ),
        ...components,
      }
    }

## Deep Dive: How do you transform markdown into HTML?

React does not natively understand markdown. The markdown plaintext
needs to first be transformed into HTML. This can be accomplished with
`remark` and `rehype`.

`remark` is an ecosystem of tools around markdown. `rehype` is the same,
but for HTML. For example, the following code snippet transforms
markdown into HTML:

``` js
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

main()

async function main() {
  const file = await unified()
    .use(remarkParse) // Convert into markdown AST
    .use(remarkRehype) // Transform to HTML AST
    .use(rehypeSanitize) // Sanitize HTML input
    .use(rehypeStringify) // Convert AST into serialized HTML
    .process('Hello, Next.js!')

  console.log(String(file)) // <p>Hello, Next.js!</p>
}
```

The `remark` and `rehype` ecosystem contains plugins for [syntax
highlighting](https://github.com/atomiks/rehype-pretty-code), [linking
headings](https://github.com/rehypejs/rehype-autolink-headings),
[generating a table of
contents](https://github.com/remarkjs/remark-toc), and more.

When using `@next/mdx` as shown above, you **do not** need to use
`remark` or `rehype` directly, as it is handled for you. We're
describing it here for a deeper understanding of what the `@next/mdx`
package is doing underneath.

## Using the Rust-based MDX compiler (Experimental)

Next.js supports a new MDX compiler written in Rust. This compiler is
still experimental and is not recommended for production use. To use the
new compiler, you need to configure `next.config.js` when you pass it to
`withMDX`:

`js filename="next.config.js" module.exports = withMDX({   experimental: {     mdxRs: true,   }, })`

## Helpful Links

-   [MDX](https://mdxjs.com)
-   [`@next/mdx`](https://www.npmjs.com/package/@next/mdx)
-   [remark](https://github.com/remarkjs/remark)
-   [rehype](https://github.com/rehypejs/rehype)
-   [Markdoc](https://markdoc.dev/docs/nextjs)
