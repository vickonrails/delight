import { useEffect, useState } from "react";
import { Loading } from "../components/loading";
import { Sidebar } from "../components/nav-sidebar";
import { NewTweet } from "../components/new-tweet";
import { Post } from "../components/post";
import TrendSidebar from "../components/trend-sidebar";
import { PostProps } from "../utils/types";
import { useAuthContext } from "../utils/use-auth-guard";

// TODO: use posts hook
export function Home() {
    const [posts, setPosts] = useState<PostProps[]>([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuthContext()

    useEffect(() => {
        setLoading(true)
        fetch('http://localhost:3000/api/posts', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(({ data }) => {
                setPosts(data.posts)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    if (loading) return <Loading />

    return (
        <main className="bg-black text-white">
            <div className="container mx-auto ">
                <div className="flex">
                    <div className="w-2/6 p-4">
                        <Sidebar />
                    </div>
                    <div className="w-4/6 border-x border-gray-700">
                        <NewTweet username={user?.name ?? ''} />

                        <div>
                            {posts.map(post => <Post post={post} />)}
                        </div>
                    </div>

                    <div className="w-3/6 p-4">
                        <TrendSidebar />
                    </div>
                </div>
            </div>
        </main>
    );
}