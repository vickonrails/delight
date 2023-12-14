# Twitter API Example
Twitter API example using local SQLite database & Prisma ORM.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

Apply prisma migration

```bash
bunx prisma migrate
```

Create user:
```typescript
// POST api/create-user {email, name, password}
app.post('/api/create-user', async (request) => {
    const { email, name, password } = await request.json()
    if (!email || !name || !password) return Response.json({
        error: 'Some fields are is required'
    })

    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) return Response.json({
        error: 'User already exists'
    }, { headers })
    const hashedPassword = await Bun.password.hash(password)

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        return Response.json({ error: null, data: { user } }, { headers })
    } catch (error) {
        return Response.json({
            error: 'An error occurred'
        })
    }
})
```
This project was created using `bun init` in bun v1.0.11. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
