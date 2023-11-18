import { DelightRequest } from "delight/dist/src/request"
import { prisma } from ".."
import { headers } from "./headers"

export async function authenticationMiddleware(request: DelightRequest, response: Response) {
    const { session: cookieSession } = request
    if (!cookieSession) return Response.json({ error: 'Unauthorized' }, { status: 401, headers })
    const session = await prisma.session.findUnique({ where: { id: cookieSession.id } })
    const isExpired = session && session.expiresAt < new Date()
    if (session && !isExpired) {
        await prisma.session.delete({ where: { id: cookieSession.id } })
        return Response.json({ error: 'Unauthorized' }, { status: 401, headers })
    }
    // might decide to check if the user has been already authenticated before and resign them based on that
    // but the main thing is that I need to check if the session is valid
}