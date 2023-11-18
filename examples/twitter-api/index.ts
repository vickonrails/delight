import { PrismaClient } from '@prisma/client';
import { Delight, loggerMiddleware } from 'delight';
import { headers } from './utils/headers';
import { sessionMiddleware } from './utils/session-middleware';

export const prisma = new PrismaClient()

const app = Delight()

app.registerMiddleware('*', loggerMiddleware)
app.registerMiddleware('*', sessionMiddleware)

// this is a usecase of where I need a middleware to handle cors

app.post('/api/posts', async (request) => {
    const { content, authorId } = await request.json()
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

app.get('/api/posts', async (request) => {
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
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (!userExists) return Response.json({ error: 'Incorrect credentials' }, { status: 401, headers })
    const passwordMatch = await Bun.password.verify(password, userExists.password)
    if (!passwordMatch) return Response.json({ error: 'Incorrect credentials' })

    // generate a session id (TODO: use a more standard method of generating session ids)

    const randomString = (Math.random() * 10).toString(36)
    const ip = request.headers.get('x-forwarded-for')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10)
    // I want to ideally do this with response.cookie('session-id', randomString)
    // TODO: handle error
    await prisma.session.create({
        data: {
            id: randomString,
            status: 'active',
            userId: userExists.id,
            ip: ip || '',
            expiresAt
        }
    })

    headers.set('Set-Cookie', `session-id=${randomString}; Expires=${expiresAt} HttpOnly; Secure; SameSite=Strict`)
    // this is where I'll most likely create a session
    // and store it to the session store
    // after which I can send the session id to the client
    // and the client can use it to make requests to the server

    return Response.json({ error: null }, {
        headers,
        status: 200
    })
})

app.post('/api/logout', async (request) => {
    const { session: cookieSession } = request

    if (cookieSession) {
        await prisma.session.delete({
            where: { id: cookieSession?.id }
        })
    }

    return Response.json({ error: null }, { headers })
})

app.route({
    handler: async () => new Response(null, { headers }),
    path: '/api/login',
    method: 'OPTIONS'
})

app.route({
    handler: async () => new Response(null, { headers }),
    path: '/api/posts',
    method: 'OPTIONS'
})

app.listen({ port: 3000 })
