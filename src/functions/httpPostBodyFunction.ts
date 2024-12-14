import { app, HttpRequest, HttpResponseInit, InvocationContext, output, StorageQueueOutput } from "@azure/functions";
import { QueueClient } from "@azure/storage-queue";
import * as dotenv from "dotenv";
import { stat } from "fs";
dotenv.config();
interface Person {
    name: string
    age: number
}

function isPerson(obj: any): obj is Person {
    return typeof obj === 'object' && obj !== null && 
           typeof obj.name === 'string' && 
           typeof obj.age === 'number'
}

async function sendToQueue(connectionString: string, queueName: string, message: string): Promise<void> {
    const queueClient = new QueueClient(connectionString, queueName);
    if (!queueClient) {
        throw new Error("Failed to create queue client.");
    }
    await queueClient.createIfNotExists()
    await queueClient.sendMessage(Buffer.from(message).toString("base64"))
}

export async function httpPostBodyFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const data: any  = await request.json()

        if (!isPerson(data)) {
            context.log("Invalid request body. Please provide a valid JSON object with name and age.");
            return {
                status: 400,
                body: JSON.stringify({
                    message: 'Please provide both name and age in the request body.',
                    statusCode: 400
                })
            }
        }
        const connectionString = process.env.QUEUE_STORAGE_CONNECTION;
        const queueName = process.env.QUEUE_INPUT_NAME;

        if (!connectionString || !queueName) {
            context.log("Queue connection string or queue name is not configured.");
            return {
                status: 500,
                body: JSON.stringify({
                    message: "Queue configuration is missing. Please check your environment variables.",
                    statusCode: 500
                })
            };
        }

        const message = JSON.stringify({...data, connectionString, queueName});

        //await sendToQueue(connectionString, queueName, message);

        return {
            status: 200,
            body: JSON.stringify({
                message: "Message sent to queue successfully." ,
                data: message,
                statusCode: 200
            })
        };
    } catch (error) {
        return {
            status: 400,
            body: JSON.stringify({
                message: error.message,
                statusCode: error.statusCode
            })
        }
    }
};

app.http('httppost', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: httpPostBodyFunction
})