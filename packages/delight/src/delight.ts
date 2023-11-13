import { ServeOptions } from "bun";
import { buildRouter } from "./router";

interface DelightOptions {
    port: ServeOptions['port']
}

export interface DelightRequest extends Request {
    params: Record<string, string>
}

export function Delight() {
    const router = buildRouter();

    return {
        route: router.route,
        listen
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

