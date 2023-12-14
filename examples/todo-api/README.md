# Todo API Example
Todo API example using local SQLite database & Prisma ORM.

To install dependencies:

```bash
bun install
```

Start dev server on Port 4000:

```bash
bun run dev

```

Apply prisma migration

```bash
bunx prisma migrate
```


Create todo:
```typescript

// api/todos with {title, description}
app.post('/api/todos', async (request) => {
    const { title, description } = await request.json();
    try {
        if (!title || description) throw new Error('Some fields are is required')
        const todo = createTodo({ title, description, done: false });
        return Response.json({ todo });
    } catch (error) {
        if (isErrorWithMessage(error)) {
            return Response.json({ error: error.message });
        }
        return Response.json({ error: 'An error occurred' });
    }
})
```

Delete Todo:

```typescript
app.delete('/api/todos/:todoId', async (request) => {
    const { postId } = request.params;
    try {
        await deleteTodo(postId)
        return Response.json({ message: 'Todo deleted' })
    } catch (error) {
        if (isErrorWithMessage(error)) {
            return Response.json({ error: error.message });
        }
        return Response.json({ error: 'An error occurred' });
    }
})
```

This project was created using `bun init` in bun v1.0.11. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
