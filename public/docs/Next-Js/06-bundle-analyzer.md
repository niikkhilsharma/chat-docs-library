[`@next/bundle-analyzer`](https://www.npmjs.com/package/@next/bundle-analyzer)
is a plugin for Next.js that helps you manage the size of your
JavaScript modules. It generates a visual report of the size of each
module and their dependencies. You can use the information to remove
large dependencies, split your code, or only load some parts when
needed, reducing the amount of data transferred to the client.

## Installation

Install the plugin by running the following command:

``` bash
npm i @next/bundle-analyzer
# or
yarn add @next/bundle-analyzer
# or
pnpm add @next/bundle-analyzer
```

Then, add the bundle analyzer's settings to your `next.config.js`.

\`\`\`js filename="next.config.js" const withBundleAnalyzer =
require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE ===
'true', })

/\*\* @type {import('next').NextConfig} \*/ const nextConfig = {}

module.exports = withBundleAnalyzer(nextConfig)


    ## Analyzing your bundles

    Run the following command to analyze your bundles:

    ```bash
    ANALYZE=true npm run build
    # or
    ANALYZE=true yarn build
    # or
    ANALYZE=true pnpm build

The report will open three new tabs in your browser, which you can
inspect. Doing this regularly while you develop and before deploying
your site can help you identify large bundles earlier, and architect
your application to be more performant.
