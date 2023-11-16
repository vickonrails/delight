export class DelightRequest extends Request {
    private _originalRequest: Request;

    public params: Record<string, string> = {};
    public queryParams: Record<string, string> = {};
    public cookies: Record<string, string> = {};
    public queryString: string = '';

    constructor(
        originalRequest: Request
    ) {
        super(originalRequest);
        this._originalRequest = originalRequest;
    }

    get originalRequest() { return this._originalRequest; }
}