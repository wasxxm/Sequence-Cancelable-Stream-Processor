/**
 * Sequence Cancelable Stream Processor
 *
 * This script was created as part of a test project assignment provided by Oleksii Mylotskyi.
 * It implements a sequence cancelable stream processor in TypeScript, handling both cancelable
 * and non-cancelable chunks based on their timeouts. The processor respects a concurrency limit
 * while ensuring that only the latest non-cancelable chunks are processed.
 *
 * Please note that this code is intended solely for evaluation purposes as part of the test project.
 *
 * Developed by: Waseem Khan
 * Date: Aug. 20, 2024
 */

// Define constants for cancelable and non-cancelable statuses
const CANCELABLE = true;
const NOT_CANCELABLE = false;

const FAILURE_ENABLER = false; // Set to false to disable random failures
const FAILURE_RATE = 0.3; // Failure rate for simulated processing failures

const CONCURRENCY_POOL = 3;

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

        // Simulate a random failure
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (FAILURE_ENABLER && Math.random() < FAILURE_RATE) {  // FAILURE_RATE * 100% chance to fail
                    reject(new Error(`Simulated failure for chunk: ${chunk.id}`));
                } else {
                    resolve();
                }
            }, 1000); // Simulate processing time
        });
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

// Instantiate the stream processor with a concurrency pool
const streamProcessor = new SequenceCancelableStream(CONCURRENCY_POOL);

// Add each chunk to the processor
chunks.forEach(([id, isCancelable, timeout]) =>
    streamProcessor.addChunk({ id, isCancelable, timeout })
);
