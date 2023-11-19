import { MiddlewareQueue } from "./middleware-queue";
import { DelightRequest } from "./request";

import { Router } from "./router";

export async function requestHandler(request: DelightRequest, middlewares: MiddlewareQueue, router: Router) {
    const requestMiddlewares = middlewares.clone()
    const response = new Response()

    // all middlewares are processed here
    // TODO: there's this bug where responses are not fully returned from the middleware queue
    // I need to fix this, but for now, I'll just return the response from the router
    await requestMiddlewares.processQueue(request, response)
    // get the handler that matches this request
    const route = router.getHandler(request)

    if (!route) {
        // TODO: possibly use a default 404 response handler (if provided by the user)
        return new Response('Not Found', { status: 404 })
    }

    // execute the handler with request and response context
    // right now, we're pipping the response through the handler, but it's still 
    // not smooth because we return an instance of a response and not the response itself
    // this is limited because the response is normally instantiated when it is created
    // and the Response.body property is read only. So we can't really use it like that.
    return route.handler(request, response);
}