import { app, InvocationContext, output } from "@azure/functions";

const outputQueue = output.storageQueue({
    queueName: 'emt-queue-output',
    connection: 'QUEUE_STORAGE_CONNECTION',
});

export async function isPersonQueueTrigger(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);
    context.extraOutputs.set(outputQueue, { status: 200, body: JSON.stringify(queueItem) });
}

app.storageQueue('isPersonQueueTrigger', {
    queueName: 'emt-queue-input',
    connection: 'QUEUE_STORAGE_CONNECTION',
    extraOutputs: [outputQueue],
    handler: isPersonQueueTrigger
});
