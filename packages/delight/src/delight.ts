import { ServeOptions } from "bun";
import { buildRouter } from "./router";

interface DelightOptions {
    port: ServeOptions['port']
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
            fetch(request: Request) {
                const route = router.getHandler(request)
                return route?.handler(request)
            }
        })
    }
}