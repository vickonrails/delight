import { Delight } from 'delight'

const app = Delight()

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
    handler: async (request) => {
        const { name } = request.params;
        return new Response(`Hello there ${name}`)
    }
})

app.get('/hi/:name', async (request) => {
    return new Response(`Hi there ${request.query.name}`)
})

app.post('/hi/:name', async (request) => {
    return new Response(`Hi there ${request.query.name}`)
})


app.listen({ port: 3000 })