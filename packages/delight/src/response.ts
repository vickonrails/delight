class DelightResponse extends Response {
    private _originalResponse: Response;

    constructor(
        originalResponse?: Response
    ) {
        if (originalResponse) {
            const { headers, status, statusText } = originalResponse;
            super(originalResponse.body, { headers, status, statusText })
            this._originalResponse = originalResponse
        } else {
            super()
            this._originalResponse = new Response()
        }
    }

    async send() {
        return this;
    }
}

// there has to be a setHeader method, getHeader, etc. Basically proxies on the original response