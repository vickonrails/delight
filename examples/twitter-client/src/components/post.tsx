import { Heart, MessageCircle, Repeat, Share } from 'react-feather'
import { PostProps } from '../utils/types'
import { Avatar } from './avatar'

export const Post = ({ post }: { post: PostProps }) => {
    const { content, author } = post
    return (
        <div className="border-y border-gray-800 py-4 px-3">
            <div className="flex items-start justify-between">
                <div className="basis-4">
                    <Avatar name={author.name} />
                </div>
                <div className="flex-1 text-sm">
                    <div className="flex gap-2 items-center">
                        <div className="font-bold">
                            {author.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                            {author.email}
                        </div>
                    </div>

                    <p className="mb-3">
                        {content}
                    </p>

                    <div className="flex justify-between text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                            <MessageCircle size={20} />
                            <span className="ml-1">20</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Repeat size={20} />
                            <span className="ml-1">20</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Heart size={20} />
                            <span className="ml-1">20</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Share size={20} />
                            <span className="ml-1">20</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}