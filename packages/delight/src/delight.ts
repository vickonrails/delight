import { ServeOptions } from "bun";
import { buildRouter } from "./router";

interface DelightOptions {
    port: ServeOptions['port']
}

export interface DelightRequest extends Request {
    params: Record<string, string>
    query: Record<string, string>
}

export function Delight() {
    const router = buildRouter();

    return {
        route: router.route,
        listen,
        routes: router.routes,
        get: (path: string, handler: (request: DelightRequest) => Response | Promise<Response>) => {
            router.route({ path, method: 'GET', handler })
        },
        post: (path: string, handler: (request: DelightRequest) => Response | Promise<Response>) => {
            router.route({ path, method: 'POST', handler })
        },
        put: (path: string, handler: (request: DelightRequest) => Response | Promise<Response>) => {
            router.route({ path, method: 'PUT', handler })
        },
        delete: (path: string, handler: (request: DelightRequest) => Response | Promise<Response>) => {
            router.route({ path, method: 'DELETE', handler })
        }
        // TODO: will implement others later...
    }

    function listen(options: DelightOptions) {
        const { port } = options
        Bun.serve({
            port,
            fetch(request: DelightRequest) {
                const route = router.getHandler(request)
                return route?.handler(request)
            }
        })
    }
}

