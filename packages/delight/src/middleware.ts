import { cookieMiddleware } from "./cookie-parser";
import { DelightRequest } from "./delight";
import { loggerMiddleware } from "./logger";
import { Middleware, MiddlewareQueue } from "./middleware-queue";

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
