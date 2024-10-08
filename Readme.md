# Sequence Cancelable Stream Processor

This project implements a sequence cancelable stream processor in TypeScript. The stream processes incoming chunks where each chunk is either cancelable or non-cancelable and arrives with a specific timeout. The solution handles these chunks by skipping cancelable chunks and processing only the latest non-cancelable chunks in a sequence, while respecting a concurrency limit.

## Problem Statement

Imagine you have a stream of incoming chunks, each with an attribute indicating whether it is cancelable. The chunks are pushed in a strict sequence (e.g., 1, 2, 3, 4, 5, etc.). The goal is to process only the latest non-cancelable chunk in the sequence, skipping the cancelable chunks, and ensure that no more than a certain number of chunks are processed concurrently.

### Example Sequence:

Given the input:
```
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
['chunk12', NOT_CANCELABLE, 1]
```

The output should show the system skipping all cancelable chunks and processing only the non-cancelable chunks in the correct order, respecting the timeout and concurrency constraints.

## Algorithm

The algorithm used to solve the problem follows these steps:

1. **Timeout Handling**: Each chunk is added to a processing queue only after its specified timeout has elapsed.
2. **Cancelable Chunk Skipping**: If a chunk is marked as cancelable, it is skipped and logged immediately after its timeout.
3. **Non-Cancelable Chunk Processing**: Non-cancelable chunks are added to a processing queue after their timeout and are processed concurrently, up to a specified concurrency limit.
4. **Concurrency Management**: The algorithm ensures that no more than the defined number of chunks are processed simultaneously, respecting the concurrency pool limit.

## Concurrency Pool

The concurrency pool is a mechanism that limits the number of chunks being processed simultaneously. For this implementation, the concurrency pool is set to 3, meaning that up to 3 chunks can be processed concurrently. The pool ensures that the system doesn’t overwhelm resources and maintains an orderly processing flow.

## Simulated Processing Failures

To test the robustness of the system, a simulated failure mechanism is introduced. This mechanism can randomly cause a chunk processing operation to fail. The failure probability is controlled by the `FAILURE_RATE`, which is set to 0.3 (30% chance of failure). The failures can be enabled or disabled using the `FAILURE_ENABLER` flag:

- **FAILURE_ENABLER**: Set to `true` to enable simulated failures, or `false` to disable them.
- **FAILURE_RATE**: Determines the probability of a chunk failing during processing.

### Example Failure Scenario

When the failure mechanism is enabled, the output might look like this:

```plaintext
Adding chunk to queue: chunk3
Processing chunk: chunk3
Adding chunk to queue: chunk6
Processing chunk: chunk6
Adding chunk to queue: chunk9
Processing chunk: chunk9
Adding chunk to queue: chunk12
Processing chunk: chunk12
Failed to process chunk: chunk6 Error: Simulated failure for chunk: chunk6
    at Timeout._onTimeout (/Users/waseemkhan/Documents/Upwork/Oleksii/Test/index.ts:77:28)
    at listOnTimeout (node:internal/timers:581:17)
    at processTimers (node:internal/timers:519:7)
Failed to process chunk: chunk12 Error: Simulated failure for chunk: chunk12
    at Timeout._onTimeout (/Users/waseemkhan/Documents/Upwork/Oleksii/Test/index.ts:77:28)
    at listOnTimeout (node:internal/timers:581:17)
    at processTimers (node:internal/timers:519:7)
Skipping chunk: chunk1
Skipping chunk: chunk2
Skipping chunk: chunk4
Skipping chunk: chunk5
Skipping chunk: chunk7
Skipping chunk: chunk8
Skipping chunk: chunk10
Skipping chunk: chunk11

```

## Installation and Setup

### Steps to Set Up and Run

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/wasxxm/Sequence-Cancelable-Stream-Processor.git
    cd Sequence-Cancelable-Stream-Processor
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Run the Program**:
    ```bash
    npx ts-node index.ts
    ```

### Example Usage

The following input is used within the code:

```typescript
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
```

### Expected Output

When you run the code, you should see output similar to this:

```plaintext
Adding chunk to queue: chunk3
Processing chunk: chunk3
Adding chunk to queue: chunk6
Processing chunk: chunk6
Adding chunk to queue: chunk9
Processing chunk: chunk9
Adding chunk to queue: chunk12
Processing chunk: chunk12
Skipping chunk: chunk1
Skipping chunk: chunk2
Skipping chunk: chunk4
Skipping chunk: chunk5
Skipping chunk: chunk7
Skipping chunk: chunk8
Skipping chunk: chunk10
Skipping chunk: chunk11
```

### Key Features

- **Concurrency Management**: The solution handles up to any number of chunks being processed simultaneously, with a concurrency pool limit of 3.
- **Efficient Processing**: Cancelable chunks are skipped, and non-cancelable chunks are processed immediately once their timeouts elapse.
- **Simulated Failures**: A failure simulation mechanism is included to test how the system handles chunk processing failures.
- **Clear Logging**: The output clearly logs which chunks are skipped and which are processed.
