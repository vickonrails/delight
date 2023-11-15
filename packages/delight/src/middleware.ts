import { DelightRequest } from "./delight";
import { MiddlewareQueue } from "./middleware-queue";

type registerMiddlewareFn = (request: DelightRequest, response: Response) => Promise<void>

export function buildMiddlewareQueue() {
    const middlewares = new MiddlewareQueue();
    return {
        registerMiddleware,
        middlewares
    }

    function registerMiddleware(path: string, middleware: registerMiddlewareFn) {
        middlewares.enqueue({ path, middleware })
    }
}
