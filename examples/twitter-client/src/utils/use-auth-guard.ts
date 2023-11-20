import { createContext, useContext } from "react";

interface User {
    id: number
    name: string
    email: string
    username: string
}

export type AuthProps = { user: User | null }
export const ProtectRouteContext = createContext<AuthProps>({ user: null })

export function useAuthContext() {
    return useContext(ProtectRouteContext)
}