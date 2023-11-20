import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { host } from "../routes/login"
import { AuthProps } from "./use-auth-guard"

export function useCurrentUser() {
    const navigate = useNavigate()
    const [user, setUser] = useState<AuthProps>({ user: null })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userFromStorage = window.localStorage.getItem('user')
        if (!userFromStorage) return
        const userId = JSON.parse(userFromStorage).id

        fetch(`${host}/me/${userId}`,
            { credentials: 'include' }
        )
            .then(res => res.json())
            .then(({ data: { user } }) => {
                setUser({ user })
            })
            .catch(err => {
                navigate('/login')
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [navigate])

    return { user, loading }
}