import { PrismaClient } from '@prisma/client';
import { Delight } from 'delight';
import { createTodo, deleteTodo, getTodo, updateTodo } from './repository';

export function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
}

export const prisma = new PrismaClient()

function main() {
    const app = Delight()

    app.post('/api/posts', async (request) => {
        const { title, description } = await request.json();
        try {
            if (!title || description) throw new Error('Some fields are is required')
            const todo = createTodo({ title, description, done: false });
            return Response.json({ todo });
        } catch (error) {
            if (isErrorWithMessage(error)) {
                return Response.json({ error: error.message });
            }
            return Response.json({ error: 'An error occurred' });
        }
    })

    app.get('/api/posts', async () => {
        const todos = await prisma.todo.findMany();
        return Response.json({ todos });
    })

    app.get('/api/posts/:postId', async (request) => {
        const { postId } = request.params;
        try {
            const todo = await getTodo(postId);
            return Response.json({ todo });
        } catch (error) {
            if (isErrorWithMessage(error)) {
                return Response.json({ error: error.message });
            }

            return Response.json({ error: 'An error occurred' });
        }
    })

    app.put('/api/posts/:postId', async (request) => {
        const { title, description, done } = await request.json();
        const { postId } = request.params;
        try {
            const todo = await updateTodo(postId, { title, description, done });
            return Response.json({ todo });
        } catch (error) {
            if (isErrorWithMessage(error)) {
                return Response.error();
            }
            return Response.error();
        }
    })

    app.delete('/api/posts/:postId', async (request) => {
        const { postId } = request.params;
        try {
            await deleteTodo(postId)
            return Response.json({ message: 'Todo deleted' })
        } catch (error) {
            if (isErrorWithMessage(error)) {
                return Response.json({ error: error.message });
            }
            return Response.json({ error: 'An error occurred' });
        }
    })

    app.listen({ port: 4000 })
}

main()