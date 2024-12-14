import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function httpGetFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    context.log(process.env['QUEUE_STORAGE_CONNECTION'] || 'AzureWebJobsStorage');

    return { body: `Hello, ${name}!` };
};

app.http('httpget', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: httpGetFunction
});
