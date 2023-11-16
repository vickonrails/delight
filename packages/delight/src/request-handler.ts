import { DelightRequest } from "./delight";
import { MiddlewareQueue } from "./middleware-queue";
import { Router } from "./router";

export function requestHandler(request: DelightRequest, middlewares: MiddlewareQueue, router: Router) {
    const response = new Response()
    const requestMiddlewares = middlewares.clone();
    requestMiddlewares.processQueue(request, response);
    // const requestMiddlewares = getMatchMiddlewares();
    // this is where I have to create a response
    // I also have to register all middlewares here
    // right before the routes handlers are executed
    const route = router.getHandler(request)
    if (!route) {
        // TODO: possibly render some kind of 404 page here (if provided by the user)
        return new Response('Not Found', { status: 404 })
    }
    return route.handler(request, response);
}