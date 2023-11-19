import { Queue } from "./queue"
import { DelightRequest } from "./request"
import { isRouteMatch } from "./router"

// I have to think if I need to call next() to continue the middleware chain (like in next).
// I might not need to do that because I'm using a queue
export type MiddlewareFn = (request: DelightRequest, response: Response) => void | Promise<Response | undefined> | Promise<void>
export interface Middleware {
    path: string,
    middleware: MiddlewareFn
}

// TODO: I'm implementing with an array right now, consider using a linked list later (for performance reasons - if any)
export class MiddlewareQueue extends Queue<Middleware> {
    constructor(defaultMiddlewares?: Middleware[]) {
        super(defaultMiddlewares)
    }

    async processQueue(request: DelightRequest, response: Response) {
        this.isProcessing = true
        while (this.queue.length > 0) {
            const item = this.queue.shift()
            if (item) {
                const isMatch = isRouteMatch(item.path, request.url) || item.path === '*'
                if (!isMatch) return;
                await item.middleware(request, response)
            }
        }
        this.isProcessing = false
    }

    clone() {
        const cloned = new MiddlewareQueue();
        this.queue.forEach((middleware) => {
            cloned.enqueue(middleware);
        });

        return cloned
    }
}
