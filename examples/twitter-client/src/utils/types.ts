export interface Author {
    id: number
    name: string
    email: string
}

export interface PostProps {
    id: number
    content: string
    authorId: string
    author: Author
}