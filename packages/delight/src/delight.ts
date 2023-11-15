import { ServeOptions } from "bun";
import { buildRouter, isRouteMatch } from "./router";

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
            fetch(request: DelightRequest) {
                const response = new Response()
                const requestMiddlewares = middlewares.clone();
                requestMiddlewares.processQueue(request, response);
                // const requestMiddlewares = getMatchMiddlewares();
                // this is where I have to create a response
                // I also have to register all middlewares here
                // right before the routes handlers are executed
                const route = router.getHandler(request)
                return route?.handler(request, response)
            }
        })
    }
}

type registerMiddlewareFn = (request: DelightRequest, response: Response) => Promise<void>

function getMatchMiddlewares() { }

function buildMiddlewareQueue() {
    const middlewares = new Queue();
    return {
        registerMiddleware,
        middlewares
    }

    function registerMiddleware(path: string, middleware: registerMiddlewareFn) {
        middlewares.enqueue({ path, middleware })
    }
}

// Is this going to return a promise? Or return a response? like next() or so...
type MiddlewareFn = (request: DelightRequest, response: Response) => Promise<void>
interface Middleware {
    path: string,
    middleware: MiddlewareFn
}

// TODO: I'm implementing with an array right now, consider using a linked list later (for performance reasons - if any)
class Queue {
    private queue: Middleware[];
    private isProcessing = false

    constructor(
        queue?: Middleware[]
    ) {
        this.queue = queue || []
    }

    enqueue(item: Middleware) {
        this.queue.push(item)
        // TODO: I don't know if I should start processing the queue immediately or wait till I start it from the outside
        // Ideally I want to process it once a request comes in right? 
        // so I shouldn't start processing before even getting a request. 
        // if (!this.isProcessing) {
        //     this.processQueue()
        // }
    }

    async processQueue(request: DelightRequest, response: Response) {
        this.isProcessing = true
        while (this.queue.length > 0) {
            const item = this.queue.shift()
            if (item) {
                const isMatch = isRouteMatch(item.path, request.url)
                if (!isMatch) return;
                await item.middleware(request, response)
            }
        }
        this.isProcessing = false
    }

    dequeue() {
        if (this.queue.length > 0) {
            return this.queue.shift()
        }
    }

    peek() {
        if (this.queue.length > 0) {
            return this.queue[0]
        }
    }

    size() {
        return this.queue.length
    }

    isEmpty() {
        return this.queue.length === 0
    }

    clone() {
        const cloned = new Queue();
        this.queue.forEach((middleware) => {
            cloned.enqueue(middleware);
        });

        return cloned
    }
}