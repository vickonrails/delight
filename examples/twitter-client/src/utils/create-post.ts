import { host } from "../routes/login"
import { PostProps } from "./types"

type CreatePostDto = Omit<PostProps, 'id' | 'author'>

export async function createPost(post: CreatePostDto) {
    try {
        const res = await fetch(`${host}/posts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })

        if (!res.ok) {
            const response = await res.json()
            throw new Error(response.message)
        }

        return await res.json()
    } catch (err) {
        if (err instanceof Error) {
            return { error: err.message }
        }
    }
}