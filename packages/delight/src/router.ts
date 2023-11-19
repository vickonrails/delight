import { DelightRequest } from "./request"

// TODO: implement a more fine-tuned routing table that's going to take note of the params, query, etc.
// TODO: infinite nesting of routes
// it's also important to be able to set response headers also
// TODO: the best way to see the use case of a middleware is to add logging functionality to the app
// I also need to send response headers
// I have to use a utility function to read the content of the body in chunks

export interface Router {
    route: (route: Route) => void
    getHandler: (request: DelightRequest) => Route | undefined
    routes: Route[]
}

export interface Route {
    path: string,
    // TODO: use a more robust type for method
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS',
    handler: (request: DelightRequest, response: Response) => Response | Promise<Response>
    params?: Record<string, string>
}

export function buildRouter(): Router {
    // TODO: use a plain array for now and something more complex later
    const routes: Route[] = [];

    return {
        route,
        getHandler,
        routes
    }

    function route(routeProps: Route) {
        // TODO: find a more performant and robust way to register the routes
        // I thought of using a hashmap instead. I could use the combination of (METHOD-url) 
        // as the key and the route as the value this will give me constant lookup time. 
        // I could also use a trie data structure, but this will do for now
        routes.push(routeProps)
    }

    function getHandler(request: DelightRequest): Route {
        const route = routes.find(route => {
            const isMatch = isRouteMatch(route.path, request.url)
            return isMatch && route.method === request.method
        })
        // TODO: ideally I don't want to throw for every route that's not found (think assets, favicons etc)
        if (!route) {
            throw new Error('Not Found')
        }
        request.params = extractParams(request.url, route.path)
        request.queryParams = extractQueryParams(request.url);
        return route
    }
}

/**
 * 
 * @param url request url
 * @param pattern pattern to match against (added to the router)
 * @returns {Object} an object of route params
 * @example given a url like this: http://localhost:3000/blog/2/comments/3
 * it's going to return { blogId: '2', commentId: '3' }
 */
export function extractParams(url: string, pattern: string) {
    const { pathname } = new URL(url);
    const params: Record<string, string> = {}
    const urlParts = pathname.split('/')
    const patternParts = pattern.split('/')

    for (let x = 0; x < urlParts.length; x++) {
        if (patternParts[x].startsWith(':')) {
            const key = patternParts[x].slice(1)
            const value = urlParts[x]
            params[key] = value
        }
    }

    return params
}

/**
 * returns true if the url matches the pattern, false if otherwise
 * @param pattern route pattern
 * @param url url of the incoming request
 * 
 * @example
 * // returns true
 * isRouteMatch('/blog/:blogId/comments/:commentId', 'http://localhost:3000/blog/2/comments/3')
 * 
 * @returns {Boolean} true if the url pattern matches the pattern
 */
export function isRouteMatch(pattern: string, url: string) {
    // This place where I'm doing the manual route comparison can be outsourced to a library like [path-to-regex](https://github.com/pillarjs/path-to-regexp)
    // FIX: edge case where the url is longer than the pattern because of leading slashes
    // TODO: one more case that's missing here is wildcard matching. I don't know how most frameworks are handling this, but I can look deeper into it
    const { pathname } = new URL(url)
    const patternParts = pattern.split('/')
    const urlParts = pathname.split('/')

    if (patternParts.length !== urlParts.length) {
        return false
    }

    for (let x = 0; x < patternParts.length; x++) {
        const patternPart = patternParts[x]
        const urlPart = urlParts[x]
        if (patternPart !== urlPart && !patternPart.startsWith(':')) {
            return false
        }
    }
    return true;
}

/**
 * @param url 
 * @returns an object of query params
 * 
 * @example given a url like this: http://localhost:3000/blog/2/comments/?author=&age=
 * it's going to return { author: '', age: '' }
 * 
 */
export function extractQueryParams(url: string) {
    const { searchParams } = new URL(url)
    const params = Object.fromEntries(searchParams.entries())
    return params
}