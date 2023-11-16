import { Delight, loggerMiddleware } from 'delight'

const app = Delight();

// first middleware will be a logger
// second middleware will be request stats
app.registerMiddleware('*', loggerMiddleware);

app.route({
    path: '/hello',
    method: 'GET',
    handler: async (request, response) => {
        return new Response('Hello there and to me')
    }
})

app.route({
    path: '/hello/:name',
    method: 'GET',
    handler: async (request, response) => {
        const { name } = request.params;
        return response.json();
    }
})

app.get('/hi', async (request) => {
    return new Response('Hi there')
})

app.get('/hi/:name', async (request) => {
    return new Response(`Hi there ${request.params.name}`)
})

app.post('/hi', async (request) => {
    return new Response(`Hi there`)
})

// TODO: 404 route to handle all not-found requests
// app.404

app.listen({ port: 3000 })