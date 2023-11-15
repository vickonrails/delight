import { Delight } from 'delight'

const app = Delight()

app.registerMiddleware('/hi', async (request, response) => {
    console.log(request.url)
})

app.registerMiddleware('/hi', async (request, response) => {
    console.log(request.method)
})

app.route({
    path: '/hello',
    method: 'GET',
    handler: async (request) => {
        return new Response('Hello there and to me')
    }
})

app.route({
    path: '/hello/:name',
    method: 'GET',
    handler: async (request, response) => {
        const { name } = request.params;
        return response.json();
        // return new Response(`Hello there ${name}`)
    }
})

app.get('/hi', async (request) => {
    return new Response('Hi there')
})

app.get('/hi/:name', async (request) => {
    console.log(request.params)
    return new Response(`Hi there ${request.params.name}`)
})

app.post('/hi/:name', async (request) => {
    return new Response(`Hi there ${request.query.name}`)
})

// TODO: 404 route to handle all not-found requests
// app.404

app.listen({ port: 3000 })