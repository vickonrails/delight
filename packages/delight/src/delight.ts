import { ServeOptions } from "bun";
import { buildMiddlewareQueue } from "./middleware";
import { requestHandler } from "./request";
import { buildRouter } from "./router";

interface DelightOptions {
    port: ServeOptions['port']
}

export interface DelightRequest extends Request {
    params: Record<string, string>
    query: Record<string, string>
}

type Handler = (request: DelightRequest, response: Response) => Response | Promise<Response>

export function Delight() {
    const router = buildRouter();
    const { registerMiddleware, middlewares } = buildMiddlewareQueue()

    return {
        route: router.route,
        listen,
        registerMiddleware,
        routes: router.routes,
        get: (path: string, handler: Handler) => {
            router.route({ path, method: 'GET', handler })
        },
        post: (path: string, handler: Handler) => {
            router.route({ path, method: 'POST', handler })
        },
        put: (path: string, handler: Handler) => {
            router.route({ path, method: 'PUT', handler })
        },
        delete: (path: string, handler: Handler) => {
            router.route({ path, method: 'DELETE', handler })
        }
        // TODO: will implement others later...
    }

    function listen(options: DelightOptions) {
        const { port } = options
        Bun.serve({
            port,
            fetch: (request: DelightRequest) => requestHandler(request, middlewares, router),
        })
    }
}
