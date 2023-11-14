import { Todo } from "@prisma/client";
import { prisma } from ".";

type TodoWithoutId = Omit<Todo, 'id'>

export async function createTodo(todo: TodoWithoutId) {
    const { title, description } = todo;
    await prisma.todo.create({
        data: {
            title,
            description,
            done: false,
        },
    })
}

export async function updateTodo(id: string, todo: TodoWithoutId) {
    const { title, description, done } = todo;
    // Note: in scenarios like these, I need some kind of some kind of top level error handling 
    if (!id) {
        throw new Error('Todo id is required');
    }

    return await prisma.todo.update({
        where: { id: Number(id) },
        data: {
            title,
            description,
            done
        },
    })
}

export async function getTodo(id: string) {
    const todo = await prisma.todo.findUnique({
        where: { id: Number(id) },
    })

    if (!todo) throw new Error('Todo not found');

    return todo
}

export async function deleteTodo(id: string) {
    if (!id) throw new Error('Todo id is required');

    return await prisma.todo.delete({
        where: { id: Number(id) },
        select: { id: true }
    })
}