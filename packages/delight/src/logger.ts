import { DelightRequest } from "./delight";

// better to export a logger middleware than to have it in the default middlewares
/**
 * 
 * @param request Request object
 * @param response Response object
 * 
 * @description
 * This middleware logs the request method and url to the console
 */
export async function loggerMiddleware(request: DelightRequest, response: Response) {
    // TODO: add support for logging to a file
    // TODO: use morgan for now, then experiment with building an inbuilt one later
    console.log(`${request.method} ${request.url}`)
}
