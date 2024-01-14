This page provides an overview of the file and folder structure of a
Next.js project. It covers top-level files and folders, configuration
files, and routing conventions within the `app` and `pages` directories.

## Top-level folders

  -------------------------------------------------------------------------- ----------------------
  [`app`](/docs/app/building-your-application/routing)                       App Router

  [`pages`](/docs/pages/building-your-application/routing)                   Pages Router

  [`public`](/docs/app/building-your-application/optimizing/static-assets)   Static assets to be
                                                                             served

  [`src`](/docs/app/building-your-application/configuring/src-directory)     Optional application
                                                                             source folder
  -------------------------------------------------------------------------- ----------------------

## Top-level files

  --------------------------------------------------------------------------------------------- ---------------------
  **Next.js**                                                                                   

  [`next.config.js`](/docs/app/api-reference/next-config-js)                                    Configuration file
                                                                                                for Next.js

  [`package.json`](/docs/getting-started/installation#manual-installation)                      Project dependencies
                                                                                                and scripts

  [`instrumentation.ts`](/docs/app/building-your-application/optimizing/instrumentation)        OpenTelemetry and
                                                                                                Instrumentation file

  [`middleware.ts`](/docs/app/building-your-application/routing/middleware)                     Next.js request
                                                                                                middleware

  [`.env`](/docs/app/building-your-application/configuring/environment-variables)               Environment variables

  [`.env.local`](/docs/app/building-your-application/configuring/environment-variables)         Local environment
                                                                                                variables

  [`.env.production`](/docs/app/building-your-application/configuring/environment-variables)    Production
                                                                                                environment variables

  [`.env.development`](/docs/app/building-your-application/configuring/environment-variables)   Development
                                                                                                environment variables

  [`.eslintrc.json`](/docs/app/building-your-application/configuring/eslint)                    Configuration file
                                                                                                for ESLint

  `.gitignore`                                                                                  Git files and folders
                                                                                                to ignore

  `next-env.d.ts`                                                                               TypeScript
                                                                                                declaration file for
                                                                                                Next.js

  `tsconfig.json`                                                                               Configuration file
                                                                                                for TypeScript

  `jsconfig.json`                                                                               Configuration file
                                                                                                for JavaScript
  --------------------------------------------------------------------------------------------- ---------------------

## `app` Routing Conventions

### Routing Files

  --------------------------------------------------------------------------------- ---------- ---------------
  [`layout`](/docs/app/api-reference/file-conventions/layout)                       `.js`      Layout
                                                                                    `.jsx`     
                                                                                    `.tsx`     

  [`page`](/docs/app/api-reference/file-conventions/page)                           `.js`      Page
                                                                                    `.jsx`     
                                                                                    `.tsx`     

  [`loading`](/docs/app/api-reference/file-conventions/loading)                     `.js`      Loading UI
                                                                                    `.jsx`     
                                                                                    `.tsx`     

  [`not-found`](/docs/app/api-reference/file-conventions/not-found)                 `.js`      Not found UI
                                                                                    `.jsx`     
                                                                                    `.tsx`     

  [`error`](/docs/app/api-reference/file-conventions/error)                         `.js`      Error UI
                                                                                    `.jsx`     
                                                                                    `.tsx`     

  [`global-error`](/docs/app/api-reference/file-conventions/error#global-errorjs)   `.js`      Global error UI
                                                                                    `.jsx`     
                                                                                    `.tsx`     

  [`route`](/docs/app/api-reference/file-conventions/route)                         `.js`      API endpoint
                                                                                    `.ts`      

  [`template`](/docs/app/api-reference/file-conventions/template)                   `.js`      Re-rendered
                                                                                    `.jsx`     layout
                                                                                    `.tsx`     

  [`default`](/docs/app/api-reference/file-conventions/default)                     `.js`      Parallel route
                                                                                    `.jsx`     fallback page
                                                                                    `.tsx`     
  --------------------------------------------------------------------------------- ---------- ---------------

### Nested Routes

  ------------------------------------------------------------------------------ --------------
  [`folder`](/docs/app/building-your-application/routing#route-segments)         Route segment

  [`folder/folder`](/docs/app/building-your-application/routing#nested-routes)   Nested route
                                                                                 segment
  ------------------------------------------------------------------------------ --------------

### Dynamic Routes

  ----------------------------------------------------------------------------------------------------------- ----------------
  [`[folder]`](/docs/app/building-your-application/routing/dynamic-routes#convention)                         Dynamic route
                                                                                                              segment

  [`[...folder]`](/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments)              Catch-all route
                                                                                                              segment

  [`[[...folder]]`](/docs/app/building-your-application/routing/dynamic-routes#optional-catch-all-segments)   Optional
                                                                                                              catch-all route
                                                                                                              segment
  ----------------------------------------------------------------------------------------------------------- ----------------

### Route Groups and Private Folders

  ------------------------------------------------------------------------------------- --------------------------
  [`(folder)`](/docs/app/building-your-application/routing/route-groups#convention)     Group routes without
                                                                                        affecting routing

  [`_folder`](/docs/app/building-your-application/routing/colocation#private-folders)   Opt folder and all child
                                                                                        segments out of routing
  ------------------------------------------------------------------------------------- --------------------------

### Parallel and Intercepted Routes

  ------------------------------------------------------------------------------------------------ ---------------
  [`@folder`](/docs/app/building-your-application/routing/parallel-routes#convention)              Named slot

  [`(.)folder`](/docs/app/building-your-application/routing/intercepting-routes#convention)        Intercept same
                                                                                                   level

  [`(..)folder`](/docs/app/building-your-application/routing/intercepting-routes#convention)       Intercept one
                                                                                                   level above

  [`(..)(..)folder`](/docs/app/building-your-application/routing/intercepting-routes#convention)   Intercept two
                                                                                                   levels above

  [`(...)folder`](/docs/app/building-your-application/routing/intercepting-routes#convention)      Intercept from
                                                                                                   root
  ------------------------------------------------------------------------------------------------ ---------------

### Metadata File Conventions

#### App Icons

  ----------------------------------------------------------------------------------------------------------------- -------------- -----------
  [`favicon`](/docs/app/api-reference/file-conventions/metadata/app-icons#favicon)                                  `.ico`         Favicon
                                                                                                                                   file

  [`icon`](/docs/app/api-reference/file-conventions/metadata/app-icons#icon)                                        `.ico` `.jpg`  App Icon
                                                                                                                    `.jpeg` `.png` file
                                                                                                                    `.svg`         

  [`icon`](/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx)         `.js` `.ts`    Generated
                                                                                                                    `.tsx`         App Icon

  [`apple-icon`](/docs/app/api-reference/file-conventions/metadata/app-icons#apple-icon)                            `.jpg`         Apple App
                                                                                                                    `.jpeg`,       Icon file
                                                                                                                    `.png`         

  [`apple-icon`](/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx)   `.js` `.ts`    Generated
                                                                                                                    `.tsx`         Apple App
                                                                                                                                   Icon
  ----------------------------------------------------------------------------------------------------------------- -------------- -----------

#### Open Graph and Twitter Images

  ----------------------------------------------------------------------------------------------------------------------------- ----------- -----------
  [`opengraph-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image#opengraph-image)                        `.jpg`      Open Graph
                                                                                                                                `.jpeg`     image file
                                                                                                                                `.png`      
                                                                                                                                `.gif`      

  [`opengraph-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx)   `.js` `.ts` Generated
                                                                                                                                `.tsx`      Open Graph
                                                                                                                                            image

  [`twitter-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image#twitter-image)                            `.jpg`      Twitter
                                                                                                                                `.jpeg`     image file
                                                                                                                                `.png`      
                                                                                                                                `.gif`      

  [`twitter-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx)     `.js` `.ts` Generated
                                                                                                                                `.tsx`      Twitter
                                                                                                                                            image
  ----------------------------------------------------------------------------------------------------------------------------- ----------- -----------

#### SEO

  -------------------------------------------------------------------------------------------------------------- -------- -----------
  [`sitemap`](/docs/app/api-reference/file-conventions/metadata/sitemap#sitemap-files-xml)                       `.xml`   Sitemap
                                                                                                                          file

  [`sitemap`](/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts)   `.js`    Generated
                                                                                                                 `.ts`    Sitemap

  [`robots`](/docs/app/api-reference/file-conventions/metadata/robots#static-robotstxt)                          `.txt`   Robots file

  [`robots`](/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file)                    `.js`    Generated
                                                                                                                 `.ts`    Robots file
  -------------------------------------------------------------------------------------------------------------- -------- -----------

## `pages` Routing Conventions

### Special Files

  ------------------------------------------------------------------------------------------------------------- --------- ----------
  [`_app`](/docs/pages/building-your-application/routing/custom-app)                                            `.js`     Custom App
                                                                                                                `.jsx`    
                                                                                                                `.tsx`    

  [`_document`](/docs/pages/building-your-application/routing/custom-document)                                  `.js`     Custom
                                                                                                                `.jsx`    Document
                                                                                                                `.tsx`    

  [`_error`](/docs/pages/building-your-application/routing/custom-error#more-advanced-error-page-customizing)   `.js`     Custom
                                                                                                                `.jsx`    Error Page
                                                                                                                `.tsx`    

  [`404`](/docs/pages/building-your-application/routing/custom-error#404-page)                                  `.js`     404 Error
                                                                                                                `.jsx`    Page
                                                                                                                `.tsx`    

  [`500`](/docs/pages/building-your-application/routing/custom-error#500-page)                                  `.js`     500 Error
                                                                                                                `.jsx`    Page
                                                                                                                `.tsx`    
  ------------------------------------------------------------------------------------------------------------- --------- ----------

### Routes

  ------------------------------------------------------------------------------------------------ ---------- --------
  **Folder convention**                                                                                       

  [`index`](/docs/pages/building-your-application/routing/pages-and-layouts#index-routes)          `.js`      Home
                                                                                                   `.jsx`     page
                                                                                                   `.tsx`     

  [`folder/index`](/docs/pages/building-your-application/routing/pages-and-layouts#index-routes)   `.js`      Nested
                                                                                                   `.jsx`     page
                                                                                                   `.tsx`     

  **File convention**                                                                                         

  [`index`](/docs/pages/building-your-application/routing/pages-and-layouts#index-routes)          `.js`      Home
                                                                                                   `.jsx`     page
                                                                                                   `.tsx`     

  [`file`](/docs/pages/building-your-application/routing/pages-and-layouts)                        `.js`      Nested
                                                                                                   `.jsx`     page
                                                                                                   `.tsx`     
  ------------------------------------------------------------------------------------------------ ---------- --------

### Dynamic Routes

  ------------------------------------------------------------------------------------------------------------------- -------- -------------
  **Folder convention**                                                                                                        

  [`[folder]/index`](/docs/pages/building-your-application/routing/dynamic-routes)                                    `.js`    Dynamic route
                                                                                                                      `.jsx`   segment
                                                                                                                      `.tsx`   

  [`[...folder]/index`](/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments)              `.js`    Catch-all
                                                                                                                      `.jsx`   route segment
                                                                                                                      `.tsx`   

  [`[[...folder]]/index`](/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments)   `.js`    Optional
                                                                                                                      `.jsx`   catch-all
                                                                                                                      `.tsx`   route segment

  **File convention**                                                                                                          

  [`[file]`](/docs/pages/building-your-application/routing/dynamic-routes)                                            `.js`    Dynamic route
                                                                                                                      `.jsx`   segment
                                                                                                                      `.tsx`   

  [`[...file]`](/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments)                      `.js`    Catch-all
                                                                                                                      `.jsx`   route segment
                                                                                                                      `.tsx`   

  [`[[...file]]`](/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments)           `.js`    Optional
                                                                                                                      `.jsx`   catch-all
                                                                                                                      `.tsx`   route segment
  ------------------------------------------------------------------------------------------------------------------- -------- -------------
