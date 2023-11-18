import { cookieMiddleware } from "./cookie-parser";
import { Middleware, MiddlewareQueue } from "./middleware-queue";
import { DelightRequest } from "./request";

type registerMiddlewareFn = (request: DelightRequest, response: Response) => Promise<void>

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

    function registerMiddleware(path: string, middleware: registerMiddlewareFn) {
        middlewares.enqueue({ path, middleware })
    }
}
