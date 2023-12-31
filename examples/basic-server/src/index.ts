import { Delight, loggerMiddleware } from 'delight-framework'

const app = Delight();

app.registerMiddleware('*', loggerMiddleware);

app.route({
    path: '/hello',
    method: 'GET',
    handler: async () => {
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

app.get('/hi', async () => {
    return new Response(JSON.stringify({ greeting: 'Hi there' }), { headers: { 'Content-Type': 'application/json' } })
})

app.get('/hi/:name', async (request) => {
    const accepts = request.headers.get('Accept')
    return new Response(`Hi there, I accept ${accepts}`)
})

app.listen({ port: 3000 })