import { Delight } from 'delight'

const app = Delight()

app.route({
    path: '/',
    method: 'GET',
    handler: async (request) => {
        return new Response('Hello there and to me')
    }
})

app.route({
    path: '/',
    method: 'POST',
    handler: async (request) => {
        return new Response('This is a post request')
    }
})

app.route({
    path: '/go',
    method: 'GET',
    handler: async (request) => {
        return new Response('handling response for go')
    }
})

app.listen({ port: 3000 })