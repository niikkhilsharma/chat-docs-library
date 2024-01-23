{/\* The content of this doc is shared between the app and pages router.
You can use the `<PagesOnly>Content</PagesOnly>` component to add
content that is specific to the Pages Router. Any shared content should
not be wrapped in a component. \*/}

`<PagesOnly>`{=html}

```{=html}
<details open>
```
```{=html}
<summary>
```
Examples
```{=html}
</summary>
```
-   [With Tailwind
    CSS](https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss)

```{=html}
</details>
```
`</PagesOnly>`{=html}

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS
framework that works exceptionally well with Next.js.

## Installing Tailwind

Install the Tailwind CSS packages and run the `init` command to generate
both the `tailwind.config.js` and `postcss.config.js` files:

`bash filename="Terminal" npm install -D tailwindcss postcss autoprefixer npx tailwindcss init -p`

## Configuring Tailwind

Inside `tailwind.config.js`, add paths to the files that will use
Tailwind CSS class names:

\`\``js filename="tailwind.config.js" /** @type {import('tailwindcss').Config} */ module.exports = {   content: [     './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the`app\`
directory.
'./pages/\*\*/\*.{js,ts,jsx,tsx,mdx}','./components/\*\*/\*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',

\], theme: { extend: {}, }, plugins: \[\], }


    You do not need to modify `postcss.config.js`.

    <AppOnly>

    ## Importing Styles

    Add the [Tailwind CSS directives](https://tailwindcss.com/docs/functions-and-directives#directives) that Tailwind will use to inject its generated styles to a [Global Stylesheet](/docs/app/building-your-application/styling/css-modules#global-styles) in your application, for example:

    ```css filename="app/globals.css"
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

Inside the [root
layout](/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required)
(`app/layout.tsx`), import the `globals.css` stylesheet to apply the
styles to every route in your application.

\`\`\`tsx filename="app/layout.tsx" switcher import type { Metadata }
from 'next'

// These styles apply to every route in the application import
'./globals.css'

export const metadata: Metadata = { title: 'Create Next App',
description: 'Generated by create next app', }

export default function RootLayout({ children, }: { children:
React.ReactNode }) { return (
```{=html}
<html lang="en">
```
```{=html}
<body>
```
{children}
```{=html}
</body>
```
```{=html}
</html>
```
) }


    ```jsx filename="app/layout.js" switcher
    // These styles apply to every route in the application
    import './globals.css'

    export const metadata = {
      title: 'Create Next App',
      description: 'Generated by create next app',
    }

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      )
    }

## Using Classes

After installing Tailwind CSS and adding the global styles, you can use
Tailwind's utility classes in your application.

`tsx filename="app/page.tsx" switcher export default function Page() {   return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1> }`

`jsx filename="app/page.js" switcher export default function Page() {   return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1> }`

`</AppOnly>`{=html}

`<PagesOnly>`{=html}

## Importing Styles

Add the [Tailwind CSS
directives](https://tailwindcss.com/docs/functions-and-directives#directives)
that Tailwind will use to inject its generated styles to a [Global
Stylesheet](/docs/pages/building-your-application/styling/css-modules#global-styles)
in your application, for example:

`css filename="styles/globals.css" @tailwind base; @tailwind components; @tailwind utilities;`

Inside the [custom app
file](/docs/pages/building-your-application/routing/custom-app)
(`pages/_app.js`), import the `globals.css` stylesheet to apply the
styles to every route in your application.

\`\`\`tsx filename="pages/\_app.tsx" switcher // These styles apply to
every route in the application import '@/styles/globals.css' import type
{ AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) { return
\<Component {...pageProps} /\> }


    ```jsx filename="pages/_app.js" switcher
    // These styles apply to every route in the application
    import '@/styles/globals.css'

    export default function App({ Component, pageProps }) {
      return <Component {...pageProps} />
    }

## Using Classes

After installing Tailwind CSS and adding the global styles, you can use
Tailwind's utility classes in your application.

`tsx filename="pages/index.tsx" switcher export default function Page() {   return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1> }`

`jsx filename="pages/index.js" switcher export default function Page() {   return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1> }`

`</PagesOnly>`{=html}

## Usage with Turbopack

As of Next.js 13.1, Tailwind CSS and PostCSS are supported with
[Turbopack](https://turbo.build/pack/docs/features/css#tailwind-css).