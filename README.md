# Delight
Experimental backend framework written in Typescript & Bun. Inspired by the simplicity of Express (Routing & middlewares).

## Check Out Examples:
- [Basic server](https://github.com/vickonrails/delight/tree/main/examples/basic-server)
- [Todo API](https://github.com/vickonrails/delight/tree/main/examples/todo-api)
- [Minimal Twitter clone](https://github.com/vickonrails/delight/tree/main/examples/twitter-client) powered by [Delight API](https://github.com/vickonrails/delight/tree/main/examples/twitter-api)

### Get started
1. Install package

```bash
bun install delight-framework@latest
```

2. Create a basic server

```typescript
// src/index.ts
import { Delight } from 'delight-framework';

function main() {
    const app = Delight();

    // add basic api routes
    app.get('/api/todos', async () => {
        return Response.json({ greeting: "hello world" });
    });

    // listen to a port
    app.listen({ port: 4000 });
}

main();
```

3. Start dev server:

```bash
bun run src/index.ts
```

4. Add a middleware

```typescript
import { Delight, loggerMiddleware } from 'delight-framework';
import { sessionMiddleware } from './utils/session-middleware';

// ...

app.registerMiddleware('*', loggerMiddleware)
app.registerMiddleware('*', sessionMiddleware)

// ...
```