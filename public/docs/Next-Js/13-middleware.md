{/\* The content of this doc is shared between the app and pages router.
You can use the `<PagesOnly>Content</PagesOnly>` component to add
content that is specific to the Pages Router. Any shared content should
not be wrapped in a component. \*/}

Middleware allows you to run code before a request is completed. Then,
based on the incoming request, you can modify the response by rewriting,
redirecting, modifying the request or response headers, or responding
directly.

Middleware runs before cached content and routes are matched. See
[Matching Paths](#matching-paths) for more details.

## Convention

Use the file `middleware.ts` (or `.js`) in the root of your project to
define Middleware. For example, at the same level as `pages` or `app`,
or inside `src` if applicable.

## Example

\`\`\`ts filename="middleware.ts" switcher import { NextResponse } from
'next/server' import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside export
function middleware(request: NextRequest) { return
NextResponse.redirect(new URL('/home', request.url)) }

// See "Matching Paths" below to learn more export const config = {
matcher: '/about/:path\*', }


    ```js filename="middleware.js" switcher
    import { NextResponse } from 'next/server'

    // This function can be marked `async` if using `await` inside
    export function middleware(request) {
      return NextResponse.redirect(new URL('/home', request.url))
    }

    // See "Matching Paths" below to learn more
    export const config = {
      matcher: '/about/:path*',
    }

## Matching Paths

Middleware will be invoked for **every route in your project**. The
following is the execution order:

1.  `headers` from `next.config.js`
2.  `redirects` from `next.config.js`
3.  Middleware (`rewrites`, `redirects`, etc.)
4.  `beforeFiles` (`rewrites`) from `next.config.js`
5.  Filesystem routes (`public/`, `_next/static/`, `pages/`, `app/`,
    etc.)
6.  `afterFiles` (`rewrites`) from `next.config.js`
7.  Dynamic Routes (`/blog/[slug]`)
8.  `fallback` (`rewrites`) from `next.config.js`

There are two ways to define which paths Middleware will run on:

1.  [Custom matcher config](#matcher)
2.  [Conditional statements](#conditional-statements)

### Matcher

`matcher` allows you to filter Middleware to run on specific paths.

`js filename="middleware.js" export const config = {   matcher: '/about/:path*', }`

You can match a single path or multiple paths with an array syntax:

`js filename="middleware.js" export const config = {   matcher: ['/about/:path*', '/dashboard/:path*'], }`

The `matcher` config allows full regex so matching like negative
lookaheads or character matching is supported. An example of a negative
lookahead to match all except specific paths can be seen here:

`js filename="middleware.js" export const config = {   matcher: [     /*      * Match all request paths except for the ones starting with:      * - api (API routes)      * - _next/static (static files)      * - _next/image (image optimization files)      * - favicon.ico (favicon file)      */     '/((?!api|_next/static|_next/image|favicon.ico).*)',   ], }`

You can also ignore prefetches (from `next/link`) that don't need to go
through the Middleware using the `missing` array:

`js filename="middleware.js" export const config = {   matcher: [     /*      * Match all request paths except for the ones starting with:      * - api (API routes)      * - _next/static (static files)      * - _next/image (image optimization files)      * - favicon.ico (favicon file)      */     {       source: '/((?!api|_next/static|_next/image|favicon.ico).*)',       missing: [         { type: 'header', key: 'next-router-prefetch' },         { type: 'header', key: 'purpose', value: 'prefetch' },       ],     },   ], }`

> **Good to know**: The `matcher` values need to be constants so they
> can be statically analyzed at build-time. Dynamic values such as
> variables will be ignored.

Configured matchers:

1.  MUST start with `/`
2.  Can include named parameters: `/about/:path` matches `/about/a` and
    `/about/b` but not `/about/a/c`
3.  Can have modifiers on named parameters (starting with `:`):
    `/about/:path*` matches `/about/a/b/c` because `*` is *zero or
    more*. `?` is *zero or one* and `+` *one or more*
4.  Can use regular expression enclosed in parenthesis: `/about/(.*)` is
    the same as `/about/:path*`

Read more details on
[path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1)
documentation.

> **Good to know**: For backward compatibility, Next.js always considers
> `/public` as `/public/index`. Therefore, a matcher of `/public/:path`
> will match.

### Conditional Statements

\`\`\`ts filename="middleware.ts" switcher import { NextResponse } from
'next/server' import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) { if
(request.nextUrl.pathname.startsWith('/about')) { return
NextResponse.rewrite(new URL('/about-2', request.url)) }

if (request.nextUrl.pathname.startsWith('/dashboard')) { return
NextResponse.rewrite(new URL('/dashboard/user', request.url)) } }


    ```js filename="middleware.js" switcher
    import { NextResponse } from 'next/server'

    export function middleware(request) {
      if (request.nextUrl.pathname.startsWith('/about')) {
        return NextResponse.rewrite(new URL('/about-2', request.url))
      }

      if (request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.rewrite(new URL('/dashboard/user', request.url))
      }
    }

## NextResponse

The `NextResponse` API allows you to:

-   `redirect` the incoming request to a different URL
-   `rewrite` the response by displaying a given URL
-   Set request headers for API Routes, `getServerSideProps`, and
    `rewrite` destinations
-   Set response cookies
-   Set response headers

`<AppOnly>`{=html}

To produce a response from Middleware, you can:

1.  `rewrite` to a route
    ([Page](/docs/app/building-your-application/routing/pages-and-layouts)
    or [Route
    Handler](/docs/app/building-your-application/routing/route-handlers))
    that produces a response
2.  return a `NextResponse` directly. See [Producing a
    Response](#producing-a-response)

`</AppOnly>`{=html}

`<PagesOnly>`{=html}

To produce a response from Middleware, you can:

1.  `rewrite` to a route
    ([Page](/docs/pages/building-your-application/routing/pages-and-layouts)
    or [Edge API
    Route](/docs/pages/building-your-application/routing/api-routes))
    that produces a response
2.  return a `NextResponse` directly. See [Producing a
    Response](#producing-a-response)

`</PagesOnly>`{=html}

## Using Cookies

Cookies are regular headers. On a `Request`, they are stored in the
`Cookie` header. On a `Response` they are in the `Set-Cookie` header.
Next.js provides a convenient way to access and manipulate these cookies
through the `cookies` extension on `NextRequest` and `NextResponse`.

1.  For incoming requests, `cookies` comes with the following methods:
    `get`, `getAll`, `set`, and `delete` cookies. You can check for the
    existence of a cookie with `has` or remove all cookies with `clear`.
2.  For outgoing responses, `cookies` have the following methods `get`,
    `getAll`, `set`, and `delete`.

\`\`\`ts filename="middleware.ts" switcher import { NextResponse } from
'next/server' import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) { // Assume a
"Cookie:nextjs=fast" header to be present on the incoming request //
Getting cookies from the request using the `RequestCookies` API let
cookie = request.cookies.get('nextjs') console.log(cookie) // =\> {
name: 'nextjs', value: 'fast', Path: '/' } const allCookies =
request.cookies.getAll() console.log(allCookies) // =\> \[{ name:
'nextjs', value: 'fast' }\]

request.cookies.has('nextjs') // =\> true
request.cookies.delete('nextjs') request.cookies.has('nextjs') // =\>
false

// Setting cookies on the response using the `ResponseCookies` API const
response = NextResponse.next() response.cookies.set('vercel', 'fast')
response.cookies.set({ name: 'vercel', value: 'fast', path: '/', })
cookie = response.cookies.get('vercel') console.log(cookie) // =\> {
name: 'vercel', value: 'fast', Path: '/' } // The outgoing response will
have a `Set-Cookie:vercel=fast;path=/` header.

return response }


    ```js filename="middleware.js" switcher
    import { NextResponse } from 'next/server'

    export function middleware(request) {
      // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
      // Getting cookies from the request using the `RequestCookies` API
      let cookie = request.cookies.get('nextjs')
      console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
      const allCookies = request.cookies.getAll()
      console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

      request.cookies.has('nextjs') // => true
      request.cookies.delete('nextjs')
      request.cookies.has('nextjs') // => false

      // Setting cookies on the response using the `ResponseCookies` API
      const response = NextResponse.next()
      response.cookies.set('vercel', 'fast')
      response.cookies.set({
        name: 'vercel',
        value: 'fast',
        path: '/',
      })
      cookie = response.cookies.get('vercel')
      console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
      // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.

      return response
    }

## Setting Headers

You can set request and response headers using the `NextResponse` API
(setting *request* headers is available since Next.js v13.0.0).

\`\`\`ts filename="middleware.ts" switcher import { NextResponse } from
'next/server' import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) { // Clone the request
headers and set a new header `x-hello-from-middleware1` const
requestHeaders = new Headers(request.headers)
requestHeaders.set('x-hello-from-middleware1', 'hello')

// You can also set request headers in NextResponse.rewrite const
response = NextResponse.next({ request: { // New request headers
headers: requestHeaders, }, })

// Set a new response header `x-hello-from-middleware2`
response.headers.set('x-hello-from-middleware2', 'hello') return
response }


    ```js filename="middleware.js" switcher
    import { NextResponse } from 'next/server'

    export function middleware(request) {
      // Clone the request headers and set a new header `x-hello-from-middleware1`
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-hello-from-middleware1', 'hello')

      // You can also set request headers in NextResponse.rewrite
      const response = NextResponse.next({
        request: {
          // New request headers
          headers: requestHeaders,
        },
      })

      // Set a new response header `x-hello-from-middleware2`
      response.headers.set('x-hello-from-middleware2', 'hello')
      return response
    }

> **Good to know**: Avoid setting large headers as it might cause [431
> Request Header Fields Too
> Large](https://developer.mozilla.org/docs/Web/HTTP/Status/431) error
> depending on your backend web server configuration.

## Producing a Response

You can respond from Middleware directly by returning a `Response` or
`NextResponse` instance. (This is available since [Next.js
v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-middleware))

\`\`\`ts filename="middleware.ts" switcher import { NextRequest } from
'next/server' import { isAuthenticated } from '@lib/auth'

// Limit the middleware to paths starting with `/api/` export const
config = { matcher: '/api/:function\*', }

export function middleware(request: NextRequest) { // Call our
authentication function to check the request if
(!isAuthenticated(request)) { // Respond with JSON indicating an error
message return Response.json( { success: false, message: 'authentication
failed' }, { status: 401 } ) } }


    ```js filename="middleware.js" switcher
    import { isAuthenticated } from '@lib/auth'

    // Limit the middleware to paths starting with `/api/`
    export const config = {
      matcher: '/api/:function*',
    }

    export function middleware(request) {
      // Call our authentication function to check the request
      if (!isAuthenticated(request)) {
        // Respond with JSON indicating an error message
        return Response.json(
          { success: false, message: 'authentication failed' },
          { status: 401 }
        )
      }
    }

### `waitUntil` and `NextFetchEvent`

The `NextFetchEvent` object extends the native
[`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent)
object, and includes the
[`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil)
method.

The `waitUntil()` method takes a promise as an argument, and extends the
lifetime of the Middleware until the promise settles. This is useful for
performing work in the background.

\`\`\`ts filename="middleware.ts" import { NextResponse } from
'next/server' import type { NextFetchEvent, NextRequest } from
'next/server'

export function middleware(req: NextRequest, event: NextFetchEvent) {
event.waitUntil( fetch('https://my-analytics-platform.com', { method:
'POST', body: JSON.stringify({ pathname: req.nextUrl.pathname }), }) )

return NextResponse.next() }


    ## Advanced Middleware Flags

    In `v13.1` of Next.js two additional flags were introduced for middleware, `skipMiddlewareUrlNormalize` and `skipTrailingSlashRedirect` to handle advanced use cases.

    `skipTrailingSlashRedirect` disables Next.js redirects for adding or removing trailing slashes. This allows custom handling inside middleware to maintain the trailing slash for some paths but not others, which can make incremental migrations easier.

    ```js filename="next.config.js"
    module.exports = {
      skipTrailingSlashRedirect: true,
    }

\`\`\`js filename="middleware.js" const legacyPrefixes = \['/docs',
'/blog'\]

export default async function middleware(req) { const { pathname } =
req.nextUrl

if (legacyPrefixes.some((prefix) =\> pathname.startsWith(prefix))) {
return NextResponse.next() }

// apply trailing slash handling if ( !pathname.endsWith('/') &&
!pathname.match(/((?!.well-known(?:/.*)?)(?:\[\^/\]+/)*\[\^/\]+.`\w`{=tex}+)/)
) { req.nextUrl.pathname += '/' return
NextResponse.redirect(req.nextUrl) } }


    `skipMiddlewareUrlNormalize` allows disabling the URL normalizing Next.js does to make handling direct visits and client-transitions the same. There are some advanced cases where you need full control using the original URL which this unlocks.

    ```js filename="next.config.js"
    module.exports = {
      skipMiddlewareUrlNormalize: true,
    }

\`\`\`js filename="middleware.js" export default async function
middleware(req) { const { pathname } = req.nextUrl

// GET /\_next/data/build-id/hello.json

console.log(pathname) // with the flag this now
/\_next/data/build-id/hello.json // without the flag this would be
normalized to /hello } \`\`\`

## Runtime

Middleware currently only supports the [Edge
runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes).
The Node.js runtime can not be used.

## Version History

  ----------------------------------------------------------------------------
  Version     Changes
  ----------- ----------------------------------------------------------------
  `v13.1.0`   Advanced Middleware flags added

  `v13.0.0`   Middleware can modify request headers, response headers, and
              send responses

  `v12.2.0`   Middleware is stable, please see the [upgrade
              guide](/docs/messages/middleware-upgrade-guide)

  `v12.0.9`   Enforce absolute URLs in Edge Runtime
              ([PR](https://github.com/vercel/next.js/pull/33410))

  `v12.0.0`   Middleware (Beta) added
  ----------------------------------------------------------------------------
