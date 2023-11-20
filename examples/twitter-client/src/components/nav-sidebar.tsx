import { useCallback } from "react"
import { Bell, Home, List, Mail, MoreHorizontal, Search, User, Users, X, Zap } from "react-feather"
import { useNavigate } from "react-router-dom"
import { host } from "../routes/login"

export const Sidebar = () => {
    const navigate = useNavigate()

    const handleLogout = useCallback(async () => {
        // TODO: error handling
        await fetch(`${host}/logout`, {
            credentials: 'include'
        })
        window.localStorage.removeItem('user')
        navigate('/login')
    }, [navigate])

    return (
        <div className="flex flex-col items-center justify-start h-screen">
            <div className="space-y-6">
                <div className="text-3xl">
                    <X />
                </div>
                <div className="flex flex-col gap-7">
                    <LinkItemWrapper>
                        <Home />
                        <span>Home</span>
                    </LinkItemWrapper>
                    <LinkItemWrapper>
                        <Search />
                        <span>Explore</span>
                    </LinkItemWrapper>
                    <LinkItemWrapper>
                        <Bell />
                        <span>Notifications</span>
                    </LinkItemWrapper>
                    <LinkItemWrapper>
                        <Mail />
                        <span>Messages</span>
                    </LinkItemWrapper>
                    <LinkItemWrapper>
                        <List />
                        <span>Lists</span>
                    </LinkItemWrapper>
                    <LinkItemWrapper>
                        <Users />
                        <span>Communities</span>
                    </LinkItemWrapper>
                    <LinkItemWrapper>
                        <Zap />
                        <span>Verified Orgs</span>
                    </LinkItemWrapper>
                    <LinkItemWrapper>
                        <User />
                        <span>Profile</span>
                    </LinkItemWrapper>
                    <LinkItemWrapper>
                        <MoreHorizontal />
                        <span>More</span>
                    </LinkItemWrapper>
                </div>
                <button className="bg-blue-500 text-white rounded-full px-16 py-2" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </div>
    )
}

function LinkItemWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex items-center gap-6 text-xl'>
            {children}
        </div>
    )
}