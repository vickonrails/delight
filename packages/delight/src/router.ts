
// TODO: implement a more fine-tuned routing table that's going to take note of the params, query, etc.
// TODO: infinite nesting of routes

export interface Route {
    path: string,
    // TODO: use a more robust type for method
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',

    handler: (request: Request) => Response | Promise<Response>
}

export function buildRouter() {
    // TODO: use a plain array for now and something more complex later
    const router: Route[] = [];

    return {
        route,
        getHandler
    }

    function route(routeProps: Route) {
        router.push(routeProps)
    }

    function getHandler(request: Request) {
        const { pathname } = new URL(request.url)
        const route = router.find(route => route.path === pathname && route.method === request.method)
        if (!route) {
            throw new Error('Not Found')
        }

        return route
    }
}