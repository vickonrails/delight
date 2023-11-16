import { describe, expect, test } from "bun:test";
import { Delight } from "../src";
import { extractParams, extractQueryParams, isRouteMatch } from "../src/router";

// TODO: right now, bun is running all the tests in the project, even the ones in the /dist folder
// I have to figure out a way to resolve that
describe("Router", () => {
    describe('Parser', () => {
        test('route params are extracted correctly', () => {
            const url = 'http://localhost:3000/blog/2/comments/3'
            const pattern = '/blog/:blogId/comments/:commentId'

            const params = extractParams(url, pattern)
            expect(params).toEqual({ blogId: '2', commentId: '3' })
        })

        test('query params are extracted correctly', () => {
            const url = 'http://localhost:3000/blog/2?author=Mosses&age=20'
            const queryParams = extractQueryParams(url)
            expect(queryParams).toEqual({ author: 'Mosses', age: '20' })
        })

        test('route & query params are extracted correctly', () => {
            const url = 'http://localhost:3000/blog/2/comments/3?author=Mosses&age=20'
            const pattern = '/blog/:blogId/comments/:commentId'
            const queryParams = extractQueryParams(url)
            const params = extractParams(url, pattern)

            expect(queryParams).toEqual({ author: 'Mosses', age: '20' })
            expect(params).toEqual({ blogId: '2', commentId: '3' })
        })

        // empty route & query params are extracted correctly 
        test('empty route & query params are extracted correctly', () => {
            const url = 'http://localhost:3000/blog/2/comments/?author=&age='
            const pattern = '/blog/:blogId/comments/:commentId'
            const queryParams = extractQueryParams(url)
            const params = extractParams(url, pattern)

            expect(queryParams).toEqual({ author: '', age: '' })
            expect(params).toEqual({ blogId: '2', commentId: '' })
        })
    })

    describe('Matcher', () => {
        test('matches basic routes', () => {
            const isMatch = isRouteMatch('/blog/archive', 'http://localhost:3000/blog/archive')
            const isNotMatch = isRouteMatch('/blog/archive', 'http://localhost:3000/blog/archives')
            expect(isMatch).toBe(true)
            expect(isNotMatch).toBe(false)
        })

        test('query params are routed correctly', () => {
            const isMatch = isRouteMatch('/blog/archive', 'http://localhost:3000/blog/archive?author=Mosses&age=20')
            expect(isMatch).toBe(true)
        })

        test('matches routes with route params', () => {
            const isMatch = isRouteMatch('/blog/archive/:archiveId/me', 'http://localhost:3000/blog/archive/123/me')
            expect(isMatch).toBe(true)
        })

        test.todo('leading slashes are ignored')
        test.todo('double slashes are ignored')
    })

    describe('Core', () => {
        test('routes are added correctly with long syntax', () => {
            const app = Delight()
            app.route({
                path: '/blog/archive',
                method: 'GET',
                handler: async (request) => {
                    return new Response('Hello there and to me')
                }
            })
            app.route({
                path: '/blog/archive/:archiveId/me',
                method: 'POST',
                handler: async (request) => {
                    return new Response('Hello there and to me')
                }
            })

            const containsAllRoutes = containsAll(app.routes, 'path', ['/blog/archive', '/blog/archive/:archiveId/me'])
            expect(app.routes.length).toBe(2)
            expect(containsAllRoutes).toBe(true)
        })

        test('routes are added correctly with short syntax', () => {
            const app = Delight()
            app.get('/blog', async (request) => {
                return new Response('Hello there and to me')
            })
            app.post('/blog/:blogId', async (request) => {
                return new Response('Hello there and to me')
            })
            app.put('/blog:/blogId', () => {
                return new Response('Hello there and to me')
            })
            app.delete('/blog:/blogId', () => {
                return new Response('Hello there and to me')
            })

            const hasAllRoutes = containsAll(app.routes, 'path', ['/blog', '/blog/:blogId'])

            expect(app.routes.length).toBe(4)
            expect(hasAllRoutes).toBe(true)

        })
        test('handler function is executed', () => { })
    })
});

function containsAll<T extends Object>(arr: T[], property: keyof T, checkArray: string[]) {
    const _checkArrays = checkArray;
    for (let x = 0; x < arr.length; x++) {
        // confirm that the property exists
        if (!arr[x].hasOwnProperty(property)) {
            throw new Error(`Property does not exist on ${arr[x]}`)
        }

        const propVal = arr[x][property] as string
        if (_checkArrays.includes(propVal)) {
            _checkArrays.splice(_checkArrays.indexOf(propVal), 1)
        }
    }

    return _checkArrays.length === 0
}