`sitemap.(xml|js|ts)` is a special file that matches the [Sitemaps XML
format](https://www.sitemaps.org/protocol.html) to help search engine
crawlers index your site more efficiently.

### Sitemap files (.xml)

For smaller applications, you can create a `sitemap.xml` file and place
it in the root of your `app` directory.

`xml filename="app/sitemap.xml" <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">   <url>     <loc>https://acme.com</loc>     <lastmod>2023-04-06T15:02:24.021Z</lastmod>     <changefreq>yearly</changefreq>     <priority>1</priority>   </url>   <url>     <loc>https://acme.com/about</loc>     <lastmod>2023-04-06T15:02:24.021Z</lastmod>     <changefreq>monthly</changefreq>     <priority>0.8</priority>   </url>   <url>     <loc>https://acme.com/blog</loc>     <lastmod>2023-04-06T15:02:24.021Z</lastmod>     <changefreq>weekly</changefreq>     <priority>0.5</priority>   </url> </urlset>`

### Generating a sitemap using code (.js, .ts)

You can use the `sitemap.(js|ts)` file convention to programmatically
**generate** a sitemap by exporting a default function that returns an
array of URLs. If using TypeScript, a [`Sitemap`](#returns) type is
available.

\`\`\`ts filename="app/sitemap.ts" switcher import { MetadataRoute }
from 'next'

export default function sitemap(): MetadataRoute.Sitemap { return \[ {
url: 'https://acme.com', lastModified: new Date(), changeFrequency:
'yearly', priority: 1, }, { url: 'https://acme.com/about', lastModified:
new Date(), changeFrequency: 'monthly', priority: 0.8, }, { url:
'https://acme.com/blog', lastModified: new Date(), changeFrequency:
'weekly', priority: 0.5, }, \] }


    ```js filename="app/sitemap.js" switcher
    export default function sitemap() {
      return [
        {
          url: 'https://acme.com',
          lastModified: new Date(),
          changeFrequency: 'yearly',
          priority: 1,
        },
        {
          url: 'https://acme.com/about',
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: 'https://acme.com/blog',
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.5,
        },
      ]
    }

Output:

`xml filename="acme.com/sitemap.xml" <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">   <url>     <loc>https://acme.com</loc>     <lastmod>2023-04-06T15:02:24.021Z</lastmod>     <changefreq>yearly</changefreq>     <priority>1</priority>   </url>   <url>     <loc>https://acme.com/about</loc>     <lastmod>2023-04-06T15:02:24.021Z</lastmod>     <changefreq>monthly</changefreq>     <priority>0.8</priority>   </url>   <url>     <loc>https://acme.com/blog</loc>     <lastmod>2023-04-06T15:02:24.021Z</lastmod>     <changefreq>weekly</changefreq>     <priority>0.5</priority>   </url> </urlset>`

### Generating multiple sitemaps

While a single sitemap will work for most applications. For large web
applications, you may need to split a sitemap into multiple files.

There are two ways you can create multiple sitemaps:

-   By nesting `sitemap.(xml|js|ts)` inside multiple route segments
    e.g. `app/sitemap.xml` and `app/products/sitemap.xml`.
-   By using the
    [`generateSitemaps`](/docs/app/api-reference/functions/generate-sitemaps)
    function.

For example, to split a sitemap using `generateSitemaps`, return an
array of objects with the sitemap `id`. Then, use the `id` to generate
the unique sitemaps.

\`\`\`ts filename="app/product/sitemap.ts" switcher import { BASE_URL }
from '@/app/lib/constants'

export async function generateSitemaps() { // Fetch the total number of
products and calculate the number of sitemaps needed return \[{ id: 0 },
{ id: 1 }, { id: 2 }, { id: 3 }\] }

export default async function sitemap({ id, }: { id: number }):
Promise\<MetadataRoute.Sitemap\> { // Google's limit is 50,000 URLs per
sitemap const start = id \* 50000 const end = start + 50000 const
products = await getProducts(
`SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}` )
return products.map((product) =\> ({ url: `${BASE_URL}/product/${id}`,
lastModified: product.date, })) }


    ```js filename="app/product/sitemap.js" switcher
    import { BASE_URL } from '@/app/lib/constants'

    export async function generateSitemaps() {
      // Fetch the total number of products and calculate the number of sitemaps needed
      return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
    }

    export default async function sitemap({ id }) {
      // Google's limit is 50,000 URLs per sitemap
      const start = id * 50000
      const end = start + 50000
      const products = await getProducts(
        `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
      )
      return products.map((product) => ({
        url: `${BASE_URL}/product/${id}`
        lastModified: product.date,
      }))
    }

In production, your generated sitemaps will be available at
`/.../sitemap/[id].xml`. For example, `/product/sitemap/1.xml`.

In development, you can view the generated sitemap on
`/.../sitemap.xml/[id]`. For example, `/product/sitemap.xml/1`. This
difference is temporary and will follow the production format.

See the [`generateSitemaps` API
reference](/docs/app/api-reference/functions/generate-sitemaps) for more
information.

## Returns

The default function exported from `sitemap.(xml|ts|js)` should return
an array of objects with the following properties:

``` tsx
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}>
```

## Version History

  -------------------------------------------------------------------------
  Version     Changes
  ----------- -------------------------------------------------------------
  `v13.4.5`   Add `changeFrequency` and `priority` attributes to sitemaps.

  `v13.3.0`   `sitemap` introduced.
  -------------------------------------------------------------------------
