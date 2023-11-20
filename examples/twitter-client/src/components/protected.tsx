import { ProtectRouteContext } from '../utils/use-auth-guard';
import { useCurrentUser } from "../utils/use-current-user";
import { Loading } from "./loading";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useCurrentUser()
    if (loading) return <Loading />

    return (
        <ProtectRouteContext.Provider value={user}>
            {children}
        </ProtectRouteContext.Provider>
    )
}