import { app, HttpRequest, HttpResponseInit, InvocationContext, output, StorageQueueOutput } from "@azure/functions";

import * as dotenv from "dotenv";
dotenv.config();

interface QueueItem {
    name: string
    age: number
}

function isPerson(obj: any): obj is QueueItem {
    return typeof obj === 'object' && obj !== null && 
           typeof obj.name === 'string' && 
           typeof obj.age === 'number'
}

const queueOutput = output.storageQueue({
    queueName: process.env.OUTPUT_QUEUE_NAME,
    connection: process.env.QUEUE_STORAGE_CONNECTION,
});

export async function isPersonQueueTrigger(queueItem:  QueueItem, context: InvocationContext): Promise<HttpResponseInit> {

    try {

        if (!isPerson(queueItem)) {
            context.log("Invalid request body. Please provide a valid JSON object with name and age.");
            return {
                status: 400,
                body: JSON.stringify({
                    message: 'Please provide both name and age in the request body.',
                    statusCode: 400
                })
            }
        }

        context.extraOutputs.set(queueOutput, 
            {
            status: 200,
            body: JSON.stringify({
                message: "User" + queueItem.name + " with age " + queueItem.age + " added to the queue",
                data: queueItem,
                statusCode: 200
            })
        })

        return {
            status: 200,
            body: JSON.stringify({
                message: "User" + queueItem.name + " with age " + queueItem.age + " added to the queue",
                data: queueItem,
                statusCode: 200
            })
        }
    } catch (error) {
        return {
            status: 400,
            body: JSON.stringify({
                message: error.message,
                statusCode: error.statusCode
            })
        }
    }
}

app.storageQueue('isPersonQueueTrigger', {
    queueName: process.env.QUEUE_INPUT_NAME,
    connection: process.env.QUEUE_STORAGE_CONNECTION,
    extraOutputs: [queueOutput],
    handler: isPersonQueueTrigger
})