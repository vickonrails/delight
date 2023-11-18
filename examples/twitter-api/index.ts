import { Delight } from 'delight'

const app = Delight()

app.post('/api/posts', async (request) => {
    return new Response('Hi')
})

app.get('/api/posts', async (request) => {
    return new Response('Hi')
})

app.get('/api/posts/:postId', async (request) => {
    return new Response('Hi')
})

app.put('/api/posts/:postId', async (request) => {
    return new Response('Hi')
})

app.delete('/api/posts/:postId', async (request) => {
    return new Response('Hi')
})

app.listen({ port: 3000 })
