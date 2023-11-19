const headers = new Headers();

// TODO: right now, the way I'm handling cookies and cors is a mess
// I need to write more context into the cors middleware and cookie middleware
// I need to additionally add utility methods to both request and response objects (request.setCookie(), response.setHeaders(), etc)

headers.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-PINGOTHER, Authorization, X-Request-With')
headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
headers.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
headers.set('Access-Control-Allow-Credentials', 'true')

export { headers }