import { Delight, loggerMiddleware } from 'delight'

const app = Delight();

// first middleware will be a logger
// second middleware will be request stats
app.registerMiddleware('*', loggerMiddleware);

app.route({
    path: '/hello',
    method: 'GET',
    handler: async (request) => {
        return new Response(JSON.stringify({ hi: 'hello' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
})

app.route({
    path: '/hello/:name',
    method: 'GET',
    handler: async (request) => {
        const { name } = request.params;
        return Response.json({ message: `Hello ${name}` }, { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
})

app.get('/hi', async (request) => {
    return new Response(JSON.stringify({ greeting: 'Hi there' }), { headers: { 'Content-Type': 'application/json' } })
})

app.get('/hi/:name', async (request) => {
    const accepts = request.headers.get('Accept')
    return new Response(`Hi there, I accept ${accepts}`)
})

// TODO: 404 route to handle all not-found requests
// app.404

app.listen({ port: 3000 })