The `draftMode` function allows you to detect [Draft
Mode](/docs/app/building-your-application/configuring/draft-mode) inside
a [Server
Component](/docs/app/building-your-application/rendering/server-components).

\`\`\`jsx filename="app/page.js" import { draftMode } from
'next/headers'

export default function Page() { const { isEnabled } = draftMode()
return (
```{=html}
<main>
```
```{=html}
<h1>
```
My Blog Post
```{=html}
</h1>
```
```{=html}
<p>
```
Draft Mode is currently {isEnabled ? 'Enabled' : 'Disabled'}
```{=html}
</p>
```
```{=html}
</main>
```
) } \`\`\`

## Version History

  Version     Changes
  ----------- -------------------------
  `v13.4.0`   `draftMode` introduced.
