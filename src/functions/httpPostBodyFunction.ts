import { app, HttpRequest, HttpResponseInit, InvocationContext, output, StorageQueueOutput } from "@azure/functions";
import { QueueClient } from "@azure/storage-queue";
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
                body: 'Please provide both name and age in the request body.'
            }
        }
        const connectionString = process.env.APPSETTING_QUEUE_STORAGE_CONNECTION;
        const queueName = process.env.APPSETTING_QUEUE_NAME;

        if (!connectionString || !queueName) {
            context.log("Queue connection string or queue name is not configured.");
            return {
                status: 500,
                body: "Queue configuration is missing. Please check your environment variables."
            };
        }

        const message = JSON.stringify(data);

        await sendToQueue(connectionString, queueName, message);

        return {
            status: 200,
            body: "Message sent to queue successfully."
        };
    } catch (error) {
        return {
            status: 400,
            body: 'Invalid request body. Please provide a valid JSON object with name and age.'
        }
    }
};

app.http('httppost', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: httpPostBodyFunction
})