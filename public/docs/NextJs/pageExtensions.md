{/\* The content of this doc is shared between the app and pages router.
You can use the `<PagesOnly>Content</PagesOnly>` component to add
content that is specific to the Pages Router. Any shared content should
not be wrapped in a component. \*/}

`<AppOnly>`{=html}

By default, Next.js accepts files with the following extensions: `.tsx`,
`.ts`, `.jsx`, `.js`. This can be modified to allow other extensions
like markdown (`.md`, `.mdx`).

\`\`\`js filename="next.config.js" const withMDX =
require('@next/mdx')()

/\*\* @type {import('next').NextConfig} \*/ const nextConfig = {
pageExtensions: \['ts', 'tsx', 'mdx'\], experimental: { mdxRs: true, },
}

module.exports = withMDX(nextConfig)


    </AppOnly>

    <PagesOnly>

    You can extend the default Page extensions (`.tsx`, `.ts`, `.jsx`, `.js`) used by Next.js. Inside `next.config.js`, add the `pageExtensions` config:

    ```js filename="next.config.js"
    module.exports = {
      pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    }

Changing these values affects *all* Next.js pages, including the
following:

-   [`middleware.js`](/docs/pages/building-your-application/routing/middleware)
-   [`instrumentation.js`](/docs/pages/building-your-application/optimizing/instrumentation)
-   `pages/_document.js`
-   `pages/_app.js`
-   `pages/api/`

For example, if you reconfigure `.ts` page extensions to `.page.ts`, you
would need to rename pages like `middleware.page.ts`,
`instrumentation.page.ts`, `_app.page.ts`.

## Including non-page files in the `pages` directory

You can colocate test files or other files used by components in the
`pages` directory. Inside `next.config.js`, add the `pageExtensions`
config:

`js filename="next.config.js" module.exports = {   pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'], }`

Then, rename your pages to have a file extension that includes `.page`
(e.g. rename `MyPage.tsx` to `MyPage.page.tsx`). Ensure you rename *all*
Next.js pages, including the files mentioned above.

`</PagesOnly>`{=html}
