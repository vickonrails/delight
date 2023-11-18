import { PrismaClient } from '@prisma/client'
import { Delight } from 'delight'

export const prisma = new PrismaClient()

const app = Delight()

// this is a usecase of where I need a middleware to handle cors
const headers = new Headers();
headers.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-PINGOTHER, Authorization, X-Request-With')
headers.set('Access-Control-Allow-Origin', '*')
headers.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
headers.set('Access-Control-Allow-Credentials', 'true')

app.post('/api/posts', async (request) => {
    const { content, authorId } = await request.json()
    console.log(content, authorId);
    if (!content || !authorId) return Response.json({
        error: 'Some fields are is required'
    }, { status: 400, headers })

    try {
        const post = await prisma.post.create({
            data: {
                content,
                authorId: parseInt(authorId)
            }
        })

        return Response.json({ error: null, data: { post } }, { headers })
    } catch (error) {
        return Response.json({
            error: 'An error occurred'
        }, { headers, status: 500 })
    }
})

app.get('/api/posts', async () => {
    // TODO: order by created at by adding it to the database
    const posts = await prisma.post.findMany({ include: { author: true } });
    return Response.json({
        data: { posts },
        count: posts.length,
        error: null
    }, {
        headers
    })
})

app.get('/api/posts/:postId', async (request) => {
    const { postId } = request.params
    if (!postId) return Response.json({
        error: 'Post id is required'
    })

    const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) }
    })

    if (!post) {
        return Response.json({
            error: 'Post not found'
        }, { status: 404 })
    }

    return Response.json({
        data: { post },
        error: null
    })
})

app.put('/api/posts/:postId', async (request) => {
    const { postId } = request.params
    if (!postId) return Response.json({
        error: 'Post id is required'
    })

    try {
        const post = await prisma.post.findUniqueOrThrow({ where: { id: parseInt(postId) } })
        await prisma.post.update({
            where: { id: parseInt(postId) },
            data: {
                content: post.content
            }
        })
        return Response.json({
            error: null,
            data: { post }
        })
    } catch (error) {
        return Response.json({
            error: 'Could not update item'
        })
    }
})

app.delete('/api/posts/:postId', async (request) => {
    const { postId } = request.params
    if (!postId) return Response.json({
        error: 'Post id is required'
    })

    try {
        await prisma.post.delete({ where: { id: parseInt(postId) } })
        return Response.json({ message: 'Deleted' })
    } catch (err) {
        return Response.json({
            error: 'Could not delete item'
        })
    }
})

app.post('/api/create-user', async (request) => {
    const { email, name, password } = await request.json()
    if (!email || !name || !password) return Response.json({
        error: 'Some fields are is required'
    })

    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) return Response.json({
        error: 'User already exists'
    }, { headers })
    const hashedPassword = await Bun.password.hash(password)

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        return Response.json({ error: null, data: { user } }, { headers })
    } catch (error) {
        return Response.json({
            error: 'An error occurred'
        })
    }
})

app.post('/api/login', async (request) => {
    const { email, password } = await request.json()
    // first confirm user exists
    const userExists = await prisma.user.findUnique({ where: { email } })
    console.log(userExists);
    if (!userExists) return Response.json({ error: 'Incorrect credentials' }, { status: 401, headers })
    // then compare password
    const passwordMatch = await Bun.password.verify(password, userExists.password)
    if (!passwordMatch) return Response.json({ error: 'Incorrect credentials' })

    return Response.json({ error: null, data: { user: userExists } }, {
        headers
    })
    // create session and store in database
    // return user along with session
})

app.route({
    handler: async (request) => new Response(null, { headers }),
    path: '/api/login',
    method: 'OPTIONS'
})

app.route({
    handler: async (request) => new Response(null, { headers }),
    path: '/api/posts',
    method: 'OPTIONS'
})

app.listen({ port: 3000 })
