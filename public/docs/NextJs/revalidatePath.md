`revalidatePath` allows you to purge [cached
data](/docs/app/building-your-application/caching) on-demand for a
specific path.

> **Good to know**:
>
> -   `revalidatePath` is available in both [Node.js and Edge
>     runtimes](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes).
> -   `revalidatePath` only invalidates the cache when the included path
>     is next visited. This means calling `revalidatePath` with a
>     dynamic route segment will not immediately trigger many
>     revalidations at once. The invalidation only happens when the path
>     is next visited.

## Parameters

``` tsx
revalidatePath(path: string, type?: 'page' | 'layout'): void;
```

-   `path`: Either a string representing the filesystem path associated
    with the data you want to revalidate (for example,
    `/product/[slug]/page`), or the literal route segment (for example,
    `/product/123`). Must be less than 1024 characters.
-   `type`: (optional) `'page'` or `'layout'` string to change the type
    of path to revalidate. If `path` contains a dynamic segment (for
    example, `/product/[slug]/page`), it must be `page`.

## Returns

`revalidatePath` does not return any value.

## Examples

### Revalidating A Specific URL

``` ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/post-1')
```

This will revalidate one specific URL on the next page visit.

### Revalidating A Page Path

``` ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'page')
// or with route groups
revalidatePath('/(main)/post/[slug]', 'page')
```

This will revalidate any URL that matches the provided `page` file on
the next page visit. This will *not* invalidate pages beneath the
specific page. For example, `/blog/[slug]` won't invalidate
`/blog/[slug]/[author]`.

### Revalidating A Layout Path

``` ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'layout')
// or with route groups
revalidatePath('/(main)/post/[slug]', 'layout')
```

This will revalidate any URL that matches the provided `layout` file on
the next page visit. This will cause pages beneath with the same layout
to revalidate on the next visit. For example, in the above case,
`/blog/[slug]/[another]` would also revalidate on the next visit.

### Revalidating All Data

``` ts
import { revalidatePath } from 'next/cache'

revalidatePath('/', 'layout')
```

This will purge the Client-side Router Cache, and revalidate the Data
Cache on the next page visit.

### Server Action

\`\`\`ts filename="app/actions.ts" switcher 'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() { await submitForm()
revalidatePath('/') }


    ### Route Handler

    ```ts filename="app/api/revalidate/route.ts" switcher
    import { revalidatePath } from 'next/cache'
    import { NextRequest } from 'next/server'

    export async function GET(request: NextRequest) {
      const path = request.nextUrl.searchParams.get('path')

      if (path) {
        revalidatePath(path)
        return Response.json({ revalidated: true, now: Date.now() })
      }

      return Response.json({
        revalidated: false,
        now: Date.now(),
        message: 'Missing path to revalidate',
      })
    }

\`\`\`js filename="app/api/revalidate/route.js" switcher import {
revalidatePath } from 'next/cache'

export async function GET(request) { const path =
request.nextUrl.searchParams.get('path')

if (path) { revalidatePath(path) return Response.json({ revalidated:
true, now: Date.now() }) }

return Response.json({ revalidated: false, now: Date.now(), message:
'Missing path to revalidate', }) } \`\`\`
