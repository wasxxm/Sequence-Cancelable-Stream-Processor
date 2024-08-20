// Define constants for cancelable and non-cancelable statuses
const CANCELABLE = true;
const NOT_CANCELABLE = false;

type Chunk = {
    id: string;
    isCancelable: boolean;
    timeout: number;
};

class SequenceCancelableStream {
    private concurrencyPool: number;
    private processingQueue: Chunk[] = [];
    private activeProcesses: number = 0;

    constructor(concurrencyPool: number) {
        this.concurrencyPool = concurrencyPool;
    }

    public addChunk(chunk: Chunk) {
        setTimeout(() => {
            if (chunk.isCancelable) {
                console.log(`Skipping chunk: ${chunk.id}`);
            } else {
                console.log(`Adding chunk to queue: ${chunk.id}`);
                this.processingQueue.push(chunk);
                this.processQueue();
            }
        }, chunk.timeout * 1000); // Convert timeout to milliseconds
    }

    private async processQueue() {
        while (this.activeProcesses < this.concurrencyPool && this.processingQueue.length > 0) {
            const chunk = this.processingQueue.shift();
            if (chunk) {
                this.activeProcesses++;
                this.processChunk(chunk)
                    .then(() => {
                        this.activeProcesses--;
                        this.processQueue();
                    })
                    .catch((error) => {
                        console.error(`Failed to process chunk: ${chunk.id}`, error);
                        this.activeProcesses--;
                        this.processQueue();
                    });
            }
        }
    }

    private async processChunk(chunk: Chunk): Promise<void> {
        console.log(`Processing chunk: ${chunk.id}`);
        return new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing time
    }
}

// Input data: [chunkID, isCancelable, timeout in seconds]
const chunks: [string, boolean, number][] = [
    ['chunk1', CANCELABLE, 10],
    ['chunk2', CANCELABLE, 10],
    ['chunk3', NOT_CANCELABLE, 1],
    ['chunk4', CANCELABLE, 10],
    ['chunk5', CANCELABLE, 10],
    ['chunk6', NOT_CANCELABLE, 1],
    ['chunk7', CANCELABLE, 10],
    ['chunk8', CANCELABLE, 10],
    ['chunk9', NOT_CANCELABLE, 1],
    ['chunk10', CANCELABLE, 10],
    ['chunk11', CANCELABLE, 10],
    ['chunk12', NOT_CANCELABLE, 1],
];

// Instantiate the stream processor with a concurrency pool of 3
const concurrencyPool = 3;
const streamProcessor = new SequenceCancelableStream(concurrencyPool);

// Add each chunk to the processor
chunks.forEach(([id, isCancelable, timeout]) =>
    streamProcessor.addChunk({ id, isCancelable, timeout })
);
