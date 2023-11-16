import { cookieMiddleware } from "./cookie-parser";
import { Middleware, MiddlewareQueue } from "./middleware-queue";
import { DelightRequest } from "./request";

type registerMiddlewareFn = (request: DelightRequest, response: Response) => Promise<void>

const defaultMiddlewares: Middleware[] = [
    { path: '*', middleware: cookieMiddleware },
]

export function buildMiddlewareQueue() {
    const middlewares = new MiddlewareQueue(defaultMiddlewares);
    return {
        registerMiddleware,
        middlewares
    }

    function registerMiddleware(path: string, middleware: registerMiddlewareFn) {
        middlewares.enqueue({ path, middleware })
    }
}
