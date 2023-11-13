import { ServeOptions } from "bun"

interface DelightOptions {
    port: ServeOptions['port']
}

export function Delight() {
    return {
        listen
    }
}

function listen(options: DelightOptions) {
    const { port } = options
    Bun.serve({
        port,
        fetch: rootHandler
    })
}

function rootHandler(request: Request) {
    return new Response('Hello there and welcome')
}