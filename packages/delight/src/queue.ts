export class Queue<T> {
    private _queue: T[];
    private _isProcessing = false

    constructor(initialItems?: T[]) {
        this._queue = initialItems || []
    }

    enqueue(item: T) {
        this.queue.push(item)
        // Ideally I want to process it once a request comes 
        // so I shouldn't start processing before even getting a request. 
        // if (!this.isProcessing) {
        //     this.processQueue()
        // }
    }

    get queue() { return this._queue; }

    set isProcessing(value: boolean) { this._isProcessing = value; }
    get isProcessing() { return this._isProcessing; }

    dequeue() {
        if (this.queue.length > 0) {
            return this.queue.shift()
        }
    }

    peek() {
        if (this.queue.length > 0) {
            return this.queue[0]
        }
    }

    size() {
        return this.queue.length
    }

    isEmpty() {
        return this.queue.length === 0
    }
}

