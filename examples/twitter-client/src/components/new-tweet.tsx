import { FormEvent, useState } from "react"
import { AlignLeft, Bold, Calendar, Image, Italic, Smile } from 'react-feather'
import { createPost } from "../utils/create-post"
import { useAuthContext } from "../utils/use-auth-guard"
import { Avatar } from "./avatar"
import { TopTabs } from "./top-tabs"

export function NewTweet({ username }: { username: string }) {
    const [content, setContent] = useState('Brace up')
    const [creatingPost, setCreatingPost] = useState(false)
    const { user } = useAuthContext()

    const handleCreatePost = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        if (!content || !user?.id) return

        setCreatingPost(true)
        const { error } = await createPost({ authorId: String(user?.id), content })

        if (error) {
            // TODO: error handling
            alert(error)
        } else {
            setContent('')
        }

        setCreatingPost(false)
    }

    return (
        <div className="container mx-auto">
            <TopTabs />
            <form className="flex items-center space-x-3 px-4" onSubmit={handleCreatePost}>
                <Avatar name={username} />
                <div className="flex-grow">
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="resize-none outline-none text-white text-lg w-full py-3 px-2 bg-inherit"
                        placeholder="What's happening"
                    />
                    <div className="flex space-x-2 mb-4 gap-2">
                        <button type="button" className="text-blue-500">
                            <Image size={18} />
                        </button>
                        <button type="button" className="text-blue-500">
                            <AlignLeft size={18} />
                        </button>
                        <button type="button" className="text-blue-500">
                            <Smile size={18} />
                        </button>
                        <button type="button" className="text-blue-500">
                            <Calendar size={18} />
                        </button>
                        <button type="button" className="text-blue-500 font-bold">
                            <Bold size={18} />
                        </button>
                        <button type="button" className="text-blue-500 italic">
                            <Italic size={18} />
                        </button>
                    </div>
                </div>
                <button type="submit" disabled={creatingPost} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full disabled:pointer-events-none disabled:opacity-50">
                    Post
                </button>
            </form>
        </div >
    )
}