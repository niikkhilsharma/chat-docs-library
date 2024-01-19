Server Actions are **asynchronous functions** that are executed on the
server. They can be used in Server and Client Components to handle form
submissions and data mutations in Next.js applications.

> **🎥 Watch:** Learn more about forms and mutations with Server Actions
> → [YouTube (10
> minutes)](https://youtu.be/dDpZfOQBMaU?si=cJZHlUu_jFhCzHUg).

## Convention

A Server Action can be defined with the React
[`"use server"`](https://react.dev/reference/react/use-server)
directive. You can place the directive at the top of an `async` function
to mark the function as a Server Action, or at the top of a separate
file to mark all exports of that file as Server Actions.

### Server Components

Server Components can use the inline function level or module level
`"use server"` directive. To inline a Server Action, add `"use server"`
to the top of the function body:

\`\`\`tsx filename="app/page.tsx" switcher // Server Component export
default function Page() { // Server Action async function create() {
'use server'

    // ...

}

return ( // ... ) }


    ```jsx filename="app/page.jsx" switcher
    // Server Component
    export default function Page() {
      // Server Action
      async function create() {
        'use server'

        // ...
      }

      return (
        // ...
      )
    }

### Client Components

Client Components can only import actions that use the module-level
`"use server"` directive.

To call a Server Action in a Client Component, create a new file and add
the `"use server"` directive at the top of it. All functions within the
file will be marked as Server Actions that can be reused in both Client
and Server Components:

\`\`\`tsx filename="app/actions.ts" switcher 'use server'

export async function create() { // ... }


    ```js filename="app/actions.js" switcher
    'use server'

    export async function create() {
      // ...
    }

\`\`\`tsx filename="app/ui/button.tsx" switcher import { create } from
'@/app/actions'

export function Button() { return ( // ... ) }


    ```jsx filename="app/ui/button.js" switcher
    import { create } from '@/app/actions'

    export function Button() {
      return (
        // ...
      )
    }

You can also pass a Server Action to a Client Component as a prop:

``` jsx
<ClientComponent updateItem={updateItem} />
```

\`\`\`jsx filename="app/client-component.jsx" 'use client'

export default function ClientComponent({ updateItem }) { return
```{=html}
<form action="{updateItem}">
```
{/\* ... \*/}
```{=html}
</form>
```
}


    ## Behavior

    - Server actions can be invoked using the `action` attribute in a [`<form>` element](#forms):
      - Server Components support progressive enhancement by default, meaning the form will be submitted even if JavaScript hasn't loaded yet or is disabled.
      - In Client Components, forms invoking Server Actions will queue submissions if JavaScript isn't loaded yet, prioritizing client hydration.
      - After hydration, the browser does not refresh on form submission.
    - Server Actions are not limited to `<form>` and can be invoked from event handlers, `useEffect`, third-party libraries, and other form elements like `<button>`.
    - Server Actions integrate with the Next.js [caching and revalidation](/docs/app/building-your-application/caching) architecture. When an action is invoked, Next.js can return both the updated UI and new data in a single server roundtrip.
    - Behind the scenes, actions use the `POST` method, and only this HTTP method can invoke them.
    - The arguments and return value of Server Actions must be serializable by React. See the React docs for a list of [serializable arguments and values](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values).
    - Server Actions are functions. This means they can be reused anywhere in your application.
    - Server Actions inherit the [runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes) from the page or layout they are used on.

    ## Examples

    ### Forms

    React extends the HTML [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form) element to allow Server Actions to be invoked with the `action` prop.

    When invoked in a form, the action automatically receives the [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) object. You don't need to use React `useState` to manage fields, instead, you can extract the data using the native [`FormData` methods](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods):

    ```tsx filename="app/invoices/page.tsx" switcher
    export default function Page() {
      async function createInvoice(formData: FormData) {
        'use server'

        const rawFormData = {
          customerId: formData.get('customerId'),
          amount: formData.get('amount'),
          status: formData.get('status'),
        }

        // mutate data
        // revalidate cache
      }

      return <form action={createInvoice}>...</form>
    }

\`\`\`jsx filename="app/invoices/page.jsx" switcher export default
function Page() { async function createInvoice(formData) { 'use server'

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate cache

}

return
```{=html}
<form action="{createInvoice}">
```
...
```{=html}
</form>
```
}


    > **Good to know:**
    >
    > - Example: [Form with Loading & Error States](https://github.com/vercel/next.js/tree/canary/examples/next-forms)
    > - When working with forms that have many fields, you may want to consider using the [`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries) method with JavaScript's [`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries). For example: `const rawFormData = Object.fromEntries(formData.entries())`
    > - See [React `<form>` documentation](https://react.dev/reference/react-dom/components/form#handle-form-submission-with-a-server-action) to learn more.

    #### Passing Additional Arguments

    You can pass additional arguments to a Server Action using the JavaScript `bind` method.

    ```tsx filename="app/client-component.tsx" highlight={6} switcher
    'use client'

    import { updateUser } from './actions'

    export function UserProfile({ userId }: { userId: string }) {
      const updateUserWithId = updateUser.bind(null, userId)

      return (
        <form action={updateUserWithId}>
          <input type="text" name="name" />
          <button type="submit">Update User Name</button>
        </form>
      )
    }

\`\`\`jsx filename="app/client-component.js" highlight={6} switcher 'use
client'

import { updateUser } from './actions'

export function UserProfile({ userId }) { const updateUserWithId =
updateUser.bind(null, userId)

return (
```{=html}
<form action="{updateUserWithId}">
```
`<input type="text" name="name" />`{=html}
`<button type="submit">`{=html}Update User Name`</button>`{=html}
```{=html}
</form>
```
) }


    The Server Action will receive the `userId` argument, in addition to the form data:

    ```js filename="app/actions.js"
    'use server'

    export async function updateUser(userId, formData) {
      // ...
    }

> **Good to know**:
>
> -   An alternative is to pass arguments as hidden input fields in the
>     form
>     (e.g. `<input type="hidden" name="userId" value={userId} />`).
>     However, the value will be part of the rendered HTML and will not
>     be encoded.
> -   `.bind` works in both Server and Client Components. It also
>     supports progressive enhancement.

#### Pending states

You can use the React
[`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
hook to show a pending state while the form is being submitted.

-   `useFormStatus` returns the status for a specific `<form>`, so it
    **must be defined as a child of the `<form>` element**.
-   `useFormStatus` is a React hook and therefore must be used in a
    Client Component.

\`\`\`tsx filename="app/submit-button.tsx" switcher 'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() { const { pending } = useFormStatus()

return ( `<button type="submit" aria-disabled={pending}>`{=html} Add
`</button>`{=html} ) }


    ```jsx filename="app/submit-button.jsx" switcher
    'use client'

    import { useFormStatus } from 'react-dom'

    export function SubmitButton() {
      const { pending } = useFormStatus()

      return (
        <button type="submit" aria-disabled={pending}>
          Add
        </button>
      )
    }

`<SubmitButton />` can then be nested in any form:

\`\`\`tsx filename="app/page.tsx" switcher import { SubmitButton } from
'@/app/submit-button' import { createItem } from '@/app/actions'

// Server Component export default async function Home() { return (
```{=html}
<form action="{createItem}">
```
`<input type="text" name="field-name" />`{=html}
`<SubmitButton />`{=html}
```{=html}
</form>
```
) }


    ```jsx filename="app/page.jsx" switcher
    import { SubmitButton } from '@/app/submit-button'
    import { createItem } from '@/app/actions'

    // Server Component
    export default async function Home() {
      return (
        <form action={createItem}>
          <input type="text" name="field-name" />
          <SubmitButton />
        </form>
      )
    }

#### Server-side validation and error handling

We recommend using HTML validation like `required` and `type="email"`
for basic client-side form validation.

For more advanced server-side validation, you can use a library like
[zod](https://zod.dev/) to validate the form fields before mutating the
data:

\`\`\`tsx filename="app/actions.ts" switcher 'use server'

import { z } from 'zod'

const schema = z.object({ email: z.string({ invalid_type_error: 'Invalid
Email', }), })

export default async function createUser(formData: FormData) { const
validatedFields = schema.safeParse({ email: formData.get('email'), })

// Return early if the form data is invalid if
(!validatedFields.success) { return { errors:
validatedFields.error.flatten().fieldErrors, } }

// Mutate data }


    ```jsx filename="app/actions.js" switcher
    'use server'

    import { z } from 'zod'

    const schema = z.object({
      email: z.string({
        invalid_type_error: 'Invalid Email',
      }),
    })

    export default async function createsUser(formData) {
      const validatedFields = schema.safeParse({
        email: formData.get('email'),
      })

      // Return early if the form data is invalid
      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
        }
      }

      // Mutate data
    }

Once the fields have been validated on the server, you can return a
serializable object in your action and use the React
[`useFormState`](https://react.dev/reference/react-dom/hooks/useFormState)
hook to show a message to the user.

-   By passing the action to `useFormState`, the action's function
    signature changes to receive a new `prevState` or `initialState`
    parameter as its first argument.
-   `useFormState` is a React hook and therefore must be used in a
    Client Component.

\`\`\`tsx filename="app/actions.ts" switcher 'use server'

export async function createUser(prevState: any, formData: FormData) {
// ... return { message: 'Please enter a valid email', } }


    ```jsx filename="app/actions.js" switcher
    'use server'

    export async function createUser(prevState, formData) {
      // ...
      return {
        message: 'Please enter a valid email',
      }
    }

Then, you can pass your action to the `useFormState` hook and use the
returned `state` to display an error message.

\`\`\`tsx filename="app/ui/signup.tsx" switcher 'use client'

import { useFormState } from 'react-dom' import { createUser } from
'@/app/actions'

const initialState = { message: '', }

export function Signup() { const \[state, formAction\] =
useFormState(createUser, initialState)

return (
```{=html}
<form action="{formAction}">
```
`<label htmlFor="email">`{=html}Email`</label>`{=html}
`<input type="text" id="email" name="email" required />`{=html} {/\* ...
\*/}
```{=html}
<p aria-live="polite" className="sr-only">
```
{state?.message}
```{=html}
</p>
```
```{=html}
<button>
```
Sign up
```{=html}
</button>
```
```{=html}
</form>
```
) }


    ```jsx filename="app/ui/signup.js" switcher
    'use client'

    import { useFormState } from 'react-dom'
    import { createUser } from '@/app/actions'

    const initialState = {
      message: '',
    }

    export function Signup() {
      const [state, formAction] = useFormState(createUser, initialState)

      return (
        <form action={formAction}>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" required />
          {/* ... */}
          <p aria-live="polite" className="sr-only">
            {state?.message}
          </p>
          <button>Sign up</button>
        </form>
      )
    }

> **Good to know:**
>
> -   Before mutating data, you should always ensure a user is also
>     authorized to perform the action. See [Authentication and
>     Authorization](#authentication-and-authorization).

#### Optimistic updates

You can use the React
[`useOptimistic`](https://react.dev/reference/react/useOptimistic) hook
to optimistically update the UI before the Server Action finishes,
rather than waiting for the response:

\`\`\`tsx filename="app/page.tsx" switcher 'use client'

import { useOptimistic } from 'react' import { send } from './actions'

type Message = { message: string }

export function Thread({ messages }: { messages: Message\[\] }) { const
\[optimisticMessages, addOptimisticMessage\] =
useOptimistic\<Message\[\]\>( messages, (state: Message\[\], newMessage:
string) =\> \[ ...state, { message: newMessage }, \] )

return (
```{=html}
<div>
```
      {optimisticMessages.map((m, k) => (
        <div key={k}>{m.message}</div>
      ))}
      <form
        action={async (formData: FormData) => {
          const message = formData.get('message')
          addOptimisticMessage(message)
          await send(message)
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>

) }


    ```jsx filename="app/page.jsx" switcher
    'use client'

    import { useOptimistic } from 'react'
    import { send } from './actions'

    export function Thread({ messages }) {
      const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        messages,
        (state, newMessage) => [...state, { message: newMessage }]
      )

      return (
        <div>
          {optimisticMessages.map((m) => (
            <div>{m.message}</div>
          ))}
          <form
            action={async (formData) => {
              const message = formData.get('message')
              addOptimisticMessage(message)
              await send(message)
            }}
          >
            <input type="text" name="message" />
            <button type="submit">Send</button>
          </form>
        </div>
      )
    }

#### Nested elements

You can invoke a Server Action in elements nested inside `<form>` such
as `<button>`, `<input type="submit">`, and `<input type="image">`.
These elements accept the `formAction` prop or [event
handlers](#event-handlers).

This is useful in cases where you want to call multiple server actions
within a form. For example, you can create a specific `<button>` element
for saving a post draft in addition to publishing it. See the [React
`<form>`
docs](https://react.dev/docs/forms#handling-multiple-submit-buttons) for
more information.

#### Programmatic form submission

You can trigger a form submission using the
[`requestSubmit()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit)
method. For example, when the user presses `⌘` + `Enter`, you can listen
for the `onKeyDown` event:

\`\`\`tsx filename="app/entry.tsx" switcher 'use client'

export function Entry() { const handleKeyDown = (e:
React.KeyboardEvent`<HTMLTextAreaElement>`{=html}) =\> { if ( (e.ctrlKey
\|\| e.metaKey) && (e.key === 'Enter' \|\| e.key === 'NumpadEnter') ) {
e.preventDefault() e.currentTarget.form?.requestSubmit() } }

return (
```{=html}
<div>
```
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>

) }


    ```jsx filename="app/entry.jsx" switcher
    'use client'

    export function Entry() {
      const handleKeyDown = (e) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === 'Enter' || e.key === 'NumpadEnter')
        ) {
          e.preventDefault()
          e.currentTarget.form?.requestSubmit()
        }
      }

      return (
        <div>
          <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
        </div>
      )
    }

This will trigger the submission of the nearest `<form>` ancestor, which
will invoke the Server Action.

### Non-form Elements

While it's common to use Server Actions within `<form>` elements, they
can also be invoked from other parts of your code such as event handlers
and `useEffect`.

#### Event Handlers

You can invoke a Server Action from event handlers such as `onClick`.
For example, to increment a like count:

\`\`\`js filename="app/actions.js" switcher 'use server'

export async function incrementLike() { // Mutate database // Return
updated data }


    ```tsx filename="app/like-button.tsx" switcher
    'use client'

    import { incrementLike } from './actions'
    import { useState } from 'react'

    export default function LikeButton({ initialLikes }: { initialLikes: number }) {
      const [likes, setLikes] = useState(initialLikes)

      return (
        <>
          <p>Total Likes: {likes}</p>
          <button
            onClick={async () => {
              const updatedLikes = await incrementLike()
              setLikes(updatedLikes)
            }}
          >
            Like
          </button>
        </>
      )
    }

To improve the user experience, we recommend using other React APIs like
[`useOptimistic`](https://react.dev/reference/react/useOptimistic) and
[`useTransition`](https://react.dev/reference/react/useTransition) to
update the UI before the Server Action finishes executing on the server,
or to show a pending state.

You can also add event handlers to form elements, for example, to save a
form field `onChange`:

\`\`\`tsx filename="app/ui/edit-post.tsx" 'use client'

import { publishPost, saveDraft } from './actions'

export default function EditPost() { return (
```{=html}
<form action="{publishPost}">
```
\<textarea name="content" onChange={async (e) =\> { await
saveDraft(e.target.value) }} /\>
`<button type="submit">`{=html}Publish`</button>`{=html}
```{=html}
</form>
```
) }


    For cases like this, where multiple events might be fired in quick succession, we recommend **debouncing** to prevent unnecessary Server Action invocations.

    #### `useEffect`

    You can use the React [`useEffect`](https://react.dev/reference/react/useEffect) hook to invoke a Server Action when the component mounts or a dependency changes. This is useful for mutations that depend on global events or need to be triggered automatically. For example, `onKeyDown` for app shortcuts, an intersection observer hook for infinite scrolling, or when the component mounts to update a view count:

    ```tsx filename="app/view-count.tsx" switcher
    'use client'

    import { incrementViews } from './actions'
    import { useState, useEffect } from 'react'

    export default function ViewCount({ initialViews }: { initialViews: number }) {
      const [views, setViews] = useState(initialViews)

      useEffect(() => {
        const updateViews = async () => {
          const updatedViews = await incrementViews()
          setViews(updatedViews)
        }

        updateViews()
      }, [])

      return <p>Total Views: {views}</p>
    }

Remember to consider the [behavior and
caveats](https://react.dev/reference/react/useEffect#caveats) of
`useEffect`.

### Error Handling

When an error is thrown, it'll be caught by the nearest
[`error.js`](/docs/app/building-your-application/routing/error-handling)
or `<Suspense>` boundary on the client. We recommend using `try/catch`
to return errors to be handled by your UI.

For example, your Server Action might handle errors from creating a new
item by returning a message:

\`\`\`ts filename="app/actions.ts" switcher 'use server'

export async function createTodo(prevState: any, formData: FormData) {
try { // Mutate data } catch (e) { throw new Error('Failed to create
task') } }


    ```js filename="app/actions.js" switcher
    'use server'

    export async function createTodo(prevState, formData) {
      try {
        //  Mutate data
      } catch (e) {
        throw new Error('Failed to create task')
      }
    }

> **Good to know:**
>
> -   Aside from throwing the error, you can also return an object to be
>     handled by `useFormState`. See [Server-side validation and error
>     handling](#server-side-validation-and-error-handling).

### Revalidating data

You can revalidate the [Next.js
Cache](/docs/app/building-your-application/caching) inside your Server
Actions with the
[`revalidatePath`](/docs/app/api-reference/functions/revalidatePath)
API:

\`\`\`ts filename="app/actions.ts" switcher 'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() { try { // ... } catch (error) { //
... }

revalidatePath('/posts') }


    ```js filename="app/actions.js" switcher
    'use server'

    import { revalidatePath } from 'next/cache'

    export async function createPost() {
      try {
        // ...
      } catch (error) {
        // ...
      }

      revalidatePath('/posts')
    }

Or invalidate a specific data fetch with a cache tag using
[`revalidateTag`](/docs/app/api-reference/functions/revalidateTag):

\`\`\`ts filename="app/actions.ts" switcher 'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() { try { // ... } catch (error) { //
... }

revalidateTag('posts') }


    ```js filename="app/actions.js" switcher
    'use server'

    import { revalidateTag } from 'next/cache'

    export async function createPost() {
      try {
        // ...
      } catch (error) {
        // ...
      }

      revalidateTag('posts')
    }

### Redirecting

If you would like to redirect the user to a different route after the
completion of a Server Action, you can use
[`redirect`](/docs/app/api-reference/functions/redirect) API. `redirect`
needs to be called outside of the `try/catch` block:

\`\`\`ts filename="app/actions.ts" switcher 'use server'

import { redirect } from 'next/navigation' import { revalidateTag } from
'next/cache'

export async function createPost(id: string) { try { // ... } catch
(error) { // ... }

revalidateTag('posts') // Update cached posts redirect(`/post/${id}`) //
Navigate to the new post page }


    ```js filename="app/actions.js" switcher
    'use server'

    import { redirect } from 'next/navigation'
    import { revalidateTag } from 'next/cache'

    export async function createPost(id) {
      try {
        // ...
      } catch (error) {
        // ...
      }

      revalidateTag('posts') // Update cached posts
      redirect(`/post/${id}`) // Navigate to the new post page
    }

### Cookies

You can `get`, `set`, and `delete` cookies inside a Server Action using
the [`cookies`](/docs/app/api-reference/functions/cookies) API:

\`\`\`ts filename="app/actions.ts" switcher 'use server'

import { cookies } from 'next/headers'

export async function exampleAction() { // Get cookie const value =
cookies().get('name')?.value

// Set cookie cookies().set('name', 'Delba')

// Delete cookie cookies().delete('name') }


    ```js filename="app/actions.js" switcher
    'use server'

    import { cookies } from 'next/headers'

    export async function exampleAction() {
      // Get cookie
      const value = cookies().get('name')?.value

      // Set cookie
      cookies().set('name', 'Delba')

      // Delete cookie
      cookies().delete('name')
    }

See [additional
examples](/docs/app/api-reference/functions/cookies#deleting-cookies)
for deleting cookies from Server Actions.

## Security

### Authentication and authorization

You should treat Server Actions as you would public-facing API
endpoints, and ensure that the user is authorized to perform the action.
For example:

\`\`\`tsx filename="app/actions.ts" 'use server'

import { auth } from './lib'

export function addItem() { const { user } = auth() if (!user) { throw
new Error('You must be signed in to perform this action') }

// ... }


    ### Closures and encryption

    Defining a Server Action inside a component creates a [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) where the action has access to the outer function's scope. For example, the `publish` action has access to the `publishVersion` variable:

    ```tsx filename="app/page.tsx" switcher
    export default function Page() {
      const publishVersion = await getLatestVersion();

      async function publish(formData: FormData) {
        "use server";
        if (publishVersion !== await getLatestVersion()) {
          throw new Error('The version has changed since pressing publish');
        }
        ...
      }

      return <button action={publish}>Publish</button>;
    }

\`\`\`jsx filename="app/page.js" switcher export default function Page()
{ const publishVersion = await getLatestVersion();

async function publish() { "use server"; if (publishVersion !== await
getLatestVersion()) { throw new Error('The version has changed since
pressing publish'); } ... }

return `<button action={publish}>`{=html}Publish`</button>`{=html}; }


    Closures are useful when you need to capture a _snapshot_ of data (e.g. `publishVersion`) at the time of rendering so that it can be used later when the action is invoked.

    However, for this to happen, the captured variables are sent to the client and back to the server when the action is invoked. To prevent sensitive data from being exposed to the client, Next.js automatically encrypts the closed-over variables. A new private key is generated for each action every time a Next.js application is built. This means actions can only be invoked for a specific build.

    > **Good to know:** We don't recommend relying on encryption alone to prevent sensitive values from being exposed on the client. Instead, you should use the [React taint APIs](/docs/app/building-your-application/data-fetching/patterns#preventing-sensitive-data-from-being-exposed-to-the-client) to proactively prevent specific data from being sent to the client.

    ### Overwriting encryption keys (advanced)

    When self-hosting your Next.js application across multiple servers, each server instance may end up with a different encryption key, leading to potential inconsistencies.

    To mitigate this, you can overwrite the encryption key using the `process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` environment variable. Specifying this variable ensures that your encryption keys are persistent across builds, and all server instances use the same key.

    This is an advanced use case where consistent encryption behavior across multiple deployments is critical for your application. You should consider standard security practices such key rotation and signing.

    > **Good to know:** Next.js applications deployed to Vercel automatically handle this.

    ### Allowed origins (advanced)

    Since Server Actions can be invoked in a `<form>` element, this opens them up to [CSRF attacks](https://developer.mozilla.org/en-US/docs/Glossary/CSRF).

    Behind the scenes, Server Actions use the `POST` method, and only this HTTP method is allowed to invoke them. This prevents most CSRF vulnerabilities in modern browsers, particularly with [SameSite cookies](https://web.dev/articles/samesite-cookies-explained) being the default.

    As an additional protection, Server Actions in Next.js also compare the [Origin header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) to the [Host header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) (or `X-Forwarded-Host`). If these don't match, the request will be aborted. In other words, Server Actions can only be invoked on the same host as the page that hosts it.

    For large applications that use reverse proxies or multi-layered backend architectures (where the server API differs from the production domain), it's recommended to use the configuration option [`serverActions.allowedOrigins`](/docs/app/api-reference/next-config-js/serverActions) option to specify a list of safe origins. The option accepts an array of strings.

    ```js filename="next.config.js"
    /** @type {import('next').NextConfig} */
    module.exports = {
      experimental: {
        serverActions: {
          allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
        },
      },
    }

Learn more about [Security and Server
Actions](https://nextjs.org/blog/security-nextjs-server-components-actions).

## Additional resources

For more information on Server Actions, check out the following React
docs:

-   [`"use server"`](https://react.dev/reference/react/use-server)
-   [`<form>`](https://react.dev/reference/react-dom/components/form)
-   [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
-   [`useFormState`](https://react.dev/reference/react-dom/hooks/useFormState)
-   [`useOptimistic`](https://react.dev/reference/react/useOptimistic)
