import { DelightRequest } from "./request";

/**
 * @param request Request object
 * @param response Response object
 * 
 * @description
 * This middleware parses the cookie header and adds it to the request object
 */
export function cookieMiddleware(request: DelightRequest, response: Response) {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader ?? '');
    request.cookies = cookies;
}

/**
 * @param cookieHeader cookie string from the request header
 * @returns {Object} cookies object
 *
 */
function parseCookies(cookieHeader: string) {
    const cookies: Record<string, string> = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const [name, value] = cookie.split('=').map(c => c.trim());
            cookies[name] = value;
        });
    }
    return cookies;
}