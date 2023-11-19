import { MiddlewareQueue } from "./middleware-queue";
import { DelightRequest } from "./request";

import { Router } from "./router";

export async function requestHandler(request: DelightRequest, middlewares: MiddlewareQueue, router: Router) {
    const requestMiddlewares = middlewares.clone()
    const response = new Response()


    // all middlewares are processed here
    await requestMiddlewares.processQueue(request, response)
    // get the handler that matches this request
    const route = router.getHandler(request)

    if (!route) {
        // TODO: possibly render some kind of 404 page here (if provided by the user)
        return new Response('Not Found', { status: 404 })
    }

    // execute the handler with request and response context
    // right now, we're pipping the response through the handler, but it's still 
    // not smooth because we return an instance of a response and not the response itself
    // this is limited because the response is normally instantiated when it is created
    // and the Response.body property is read only. So we can't really use it like that.
    return route.handler(request, response);
}