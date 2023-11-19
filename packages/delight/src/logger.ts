

// better to export a logger middleware than to have it in the default middlewares

import { DelightRequest } from "./request";

/**
 * 
 * @param request Request object
 * @param response Response object
 * 
 * @description
 * This middleware logs the request method and url to the console
 */
export async function loggerMiddleware(request: DelightRequest, response: Response) {
    // TODO: add support for logging to an external file
    // TODO: I can experiment with using an external logger library or build one that goes together with the framework
    console.log(`${request.method} ${request.url}`)
}
