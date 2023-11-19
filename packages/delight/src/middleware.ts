import { cookieMiddleware } from "./cookie-parser";
import { Middleware, MiddlewareFn, MiddlewareQueue } from "./middleware-queue";

const defaultMiddlewares: Middleware[] = [
    { path: '*', middleware: cookieMiddleware },
]

// TODO: I have to export another cors middleware that takes care of headers
// TODO: I also have to build a fine way to manage headers
// TODO: I also have to add the OPTIONS method to the router to handle the preflight request

export function buildMiddlewareQueue() {
    const middlewares = new MiddlewareQueue(defaultMiddlewares);
    return {
        registerMiddleware,
        middlewares
    }

    function registerMiddleware(path: string, middleware: MiddlewareFn) {
        middlewares.enqueue({ path, middleware })
    }
}
