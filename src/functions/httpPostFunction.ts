import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";

interface Person {
    name: string
    age: number
}

export async function httpPostFunction(request: any, context: InvocationContext): Promise<HttpResponseInit> {
    const name = request.body.name || 'stranger';

    const queueOutput = output.storageQueue({
        queueName: process.env['OUTPUT_QUEUE_NAME'] || 'emt-queue-output',
        connection: process.env['QUEUE_STORAGE_CONNECTION'] || 'AzureWebJobsStorage',
    });

    context.extraOutputs.set(queueOutput,name)

    return { body: `Hello, ${name}!` };
};

app.http('httppost', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [],
    handler: httpPostFunction
});
