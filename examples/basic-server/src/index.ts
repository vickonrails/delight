import { Delight } from 'delight'

const app = Delight()

// get
// get with route params
// get with query params
// post
// put
// delete

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



app.listen({ port: 3000 })