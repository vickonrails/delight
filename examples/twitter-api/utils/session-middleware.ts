import { DelightRequest } from "delight/dist/src/request";
import { prisma } from "..";

export async function sessionMiddleware(request: DelightRequest, response: Response) {
    const sessionId = request.cookies['session-id']
    if (!sessionId) return
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return
    const isExpired = session && session.expiresAt < new Date()
    if (isExpired) {
        await prisma.session.delete({ where: { id: sessionId } })
        return
    }

    if (session) request.session = session;
}