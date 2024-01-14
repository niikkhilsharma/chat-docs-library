`unstable_cache` allows you to cache the results of expensive
operations, like database queries, and reuse them across multiple
requests.

``` jsx
import { getUser } from './data';
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ['my-app-user']
);

export default async function Component({ userID }) {
  const user = await getCachedUser(userID);
  ...
}
```

> **Warning**: This API is unstable and may change in the future. We
> will provide migration documentation and codemods, if needed, as this
> API stabilizes.

## Parameters

``` jsx
const data = unstable_cache(fetchData, keyParts, options)()
```

-   `fetchData`: This is an asynchronous function that fetches the data
    you want to cache. It must be a function that returns a `Promise`.
-   `keyParts`: This is an array that identifies the cached key. It must
    contain globally unique values that together identify the key of the
    data being cached. The cache key also includes the arguments passed
    to the function.
-   `options`: This is an object that controls how the cache behaves. It
    can contain the following properties:
    -   `tags`: An array of tags that can be used to control cache
        invalidation.
    -   `revalidate`: The number of seconds after which the cache should
        be revalidated.

## Returns

`unstable_cache` returns a function that when invoked, returns a Promise
that resolves to the cached data. If the data is not in the cache, the
provided function will be invoked, and its result will be cached and
returned.

## Version History

  Version     Changes
  ----------- ------------------------------
  `v14.0.0`   `unstable_cache` introduced.
