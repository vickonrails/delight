import { PrismaClient } from '@prisma/client';
import { Delight, loggerMiddleware } from 'delight';
import { DelightRequest } from 'delight/dist/src/request';
import { authenticationMiddleware } from './utils/authentication-middleware';
import { headers } from './utils/headers';
import { sessionMiddleware } from './utils/session-middleware';

export const prisma = new PrismaClient()

function isAuthenticated(request: DelightRequest) {
    return !!request.session
}

const app = Delight()

app.registerMiddleware('*', loggerMiddleware)
app.registerMiddleware('*', sessionMiddleware)
app.registerMiddleware('*', authenticationMiddleware)

/**
 * create new post
 */
app.post('/api/posts', async (request) => {
    if (!isAuthenticated(request)) {
        return Response.json({ message: 'an error occurred' }, { status: 401 })
    }

    const { content, authorId } = await request.json()
    if (!content || !authorId) return Response.json({
        error: 'Some fields are is required'
    }, { status: 400, headers })

    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(authorId) } })
        if (!user) {
            return Response.json({ message: 'user does not exist' }, { status: 400 })
        }

        const post = await prisma.post.create({
            data: {
                content,
                authorId: user.id
            }
        })

        return Response.json({ error: null }, { headers })
    } catch (error) {
        return Response.json({
            error: `An error occurred`
        }, { headers, status: 500 })
    }
})

/**
 * get all posts
 */
app.get('/api/posts', async (request) => {
    if (!isAuthenticated(request)) {
        return Response.json({ message: 'an error occurred' }, { status: 401 })
    }

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

/**
 * get all posts
 */
app.get('/api/posts/:postId', async (request) => {
    if (!isAuthenticated(request)) {
        return Response.json({ message: 'an error occurred' }, { status: 401 })
    }

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

/**
 * update a post
 */
app.put('/api/posts/:postId', async (request) => {
    if (!isAuthenticated(request)) {
        return Response.json({ message: 'an error occurred' }, { status: 401 })
    }

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

/**
 * delete a post
 */
app.delete('/api/posts/:postId', async (request) => {
    if (!isAuthenticated(request)) {
        return Response.json({ message: 'an error occurred' }, { status: 401 })
    }

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

/**
 * create a user (create account)
 */
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

/**
 * login
 */
app.post('/api/login', async (request) => {
    const { email, password } = await request.json()
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (!userExists) return Response.json({ error: 'Incorrect credentials' }, { status: 401, headers })
    const passwordMatch = await Bun.password.verify(password, userExists.password)
    if (!passwordMatch) return Response.json({ error: 'Incorrect credentials' })

    // TODO: use a more standard method of generating session ids)
    const randomString = (Math.random() * 10).toString(36)
    const ip = request.headers.get('x-forwarded-for')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10)
    // I want to ideally do this with response.cookie('session-id', randomString)
    // TODO: handle error
    const { userId } = await prisma.session.create({
        data: {
            id: randomString,
            status: 'active',
            userId: userExists.id,
            ip: ip || '192.10.10',
            expiresAt
        }
    })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return Response.json({ error: 'Incorrect credentials' }, { status: 401, headers });

    const userDto = {
        id: user.id,
        email: user.email,
        name: user.name
    }

    // manually set all the required cookies for the session
    headers.set('Set-Cookie', `session-id=${randomString}; Expires=${expiresAt}; Domain=localhost; Path=/; HttpOnly; SameSite=Lax;`)

    return Response.json({
        error: null,
        data: userDto
    }, {
        headers,
        status: 200
    })
})

/**
 * logout
 */
app.get('/api/logout', async (request) => {
    const { session: cookieSession } = request

    if (cookieSession) {
        await prisma.session.delete({
            where: { id: cookieSession?.id }
        })
    }

    return Response.json({ error: null }, { headers })
})

/**
 * get current user
 */
app.get('/api/me/:userId', async (request) => {
    if (!isAuthenticated(request)) {
        return Response.json({ message: 'an error occurred' }, { status: 401 })
    }
    const { userId } = request.params

    if (!userId) return Response.json({ error: 'User id is required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } })

    return Response.json({ error: null, data: { user } }, { headers })
})

// This are the routes to handle the preflight request for requests with ContentType: application/json header
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