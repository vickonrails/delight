
// TODO: implement a more fine-tuned routing table that's going to take note of the params, query, etc.
// TODO: infinite nesting of routes
// it's also important to be able to set response headers also
// TODO: the best way to see the use case of a middleware is to add logging functionality to the app
// I also need to send response headers

import { DelightRequest } from "./delight";

export interface Route {
    path: string,
    // TODO: use a more robust type for method
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    handler: (request: DelightRequest) => Response | Promise<Response>
    params?: Record<string, string>
}

export function buildRouter() {
    // TODO: use a plain array for now and something more complex later
    const router: Route[] = [];

    return {
        route,
        getHandler
    }

    function route(routeProps: Route) {
        // TODO: here where I'm registering the route, I have to add support for route params and query params
        // say a user enters localhost:3000/hello/2, I should be able to respond to this even if the url is localhost:3000/hello/:id
        router.push(routeProps)
    }

    function getHandler(request: DelightRequest) {
        const { pathname } = new URL(request.url)
        const route = router.find(route => {
            const isMatch = isRouteMatch(pathname, route.path)
            return isMatch && route.method === request.method
        })
        if (!route) {
            throw new Error('Not Found')
        }
        request.params = extractParams(pathname, route.path)
        return route
    }
}

function extractParams(url: string, path: string) {
    const params: Record<string, string> = {}
    const urlParts = url.split('/')
    const pathParts = path.split('/')

    for (let x = 0; x < urlParts.length; x++) {
        if (pathParts[x].startsWith(':')) {
            const key = pathParts[x].slice(1)
            const value = urlParts[x]
            params[key] = value
        }
    }

    return params
}

function isRouteMatch(pattern: string, url: string) {
    const patternParts = pattern.split('/')
    const urlParts = url.split('/')

    if (patternParts.length !== urlParts.length) {
        return false
    }

    for (let x = 0; x < patternParts.length; x++) {
        const patternPart = patternParts[x]
        const urlPart = urlParts[x]

        if (patternPart !== urlPart && !patternPart.startsWith(':')) {
            return false
        }

        return true;
    }
}
