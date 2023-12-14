# Basic Server Example

To install dependencies:

```bash
bun install
```

Start dev server:

```bash
bun run dev
```

Runs on localhost port 3000

GET /hello
```typescript


app.route({
    path: '/hello',
    method: 'GET',
    handler: async () => {
        return new Response(JSON.stringify({ hi: 'hello' }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        })
    }
})

// response 
{hi: "hello"}
```
Get /hi/:param

```typescript
app.get('/hi/:name', async (request) => {
    const accepts = request.headers.get('Accept')
    return new Response(`Hi there, I accept ${accepts}`)
})
```

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.