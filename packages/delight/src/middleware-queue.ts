import { DelightRequest } from "./delight"
import { Queue } from "./queue"
import { isRouteMatch } from "./router"

// Is this going to return a promise? Or return a response? like next() or so...
type MiddlewareFn = (request: DelightRequest, response: Response) => Promise<void>
export interface Middleware {
    path: string,
    middleware: MiddlewareFn
}

// TODO: I'm implementing with an array right now, consider using a linked list later (for performance reasons - if any)
export class MiddlewareQueue extends Queue<Middleware> {
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

    clone() {
        const cloned = new MiddlewareQueue();
        this.queue.forEach((middleware) => {
            cloned.enqueue(middleware);
        });

        return cloned
    }
}
