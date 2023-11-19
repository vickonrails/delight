const headers = new Headers();

headers.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-PINGOTHER, Authorization, X-Request-With')
headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
headers.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
headers.set('Access-Control-Allow-Credentials', 'true')

export { headers }