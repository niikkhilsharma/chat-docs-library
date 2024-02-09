Rules:
1. You're going to name the documentation in camelCase but also keeping the first letter capital. For example: `nextjs` will be `NextJs`. And if the documentation name is even larger of little different like `next auth` then it will be `NextAuth`.




# Contributing
## Things to take care before pushing the code for production
1. Make sure to replace the import for the prisma from the prisme edge instead of client.
2. Make sure to change the NEXTAUTH_URL in the .env file.
3. Make sure to change the DATABASE_URL to the prisma accelerate one and also to see the DB_URL is set to mongodb Url in the .env file.




