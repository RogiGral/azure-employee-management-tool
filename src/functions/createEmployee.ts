import { CosmosClient } from "@azure/cosmos";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as dotenv from "dotenv";
import { cosmosDbService } from "../services/cosmosDb.service";
dotenv.config();

interface Employee {
    name: string;
    department: string;
    designation: string;
    salary: number;
}

function isEmployee(obj: any): obj is Employee {
    return typeof obj === 'object' && obj !== null &&
        typeof obj.name === 'string' &&
        typeof obj.department === 'string' &&
        typeof obj.designation === 'string' &&
        typeof obj.salary === 'number';
}

export async function createEmployee(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    try {
        
        const employee = await new Response(request.body).json();
        context.log(request.body);
        if (!isEmployee(employee)) {
            context.log("Invalid request body. Please provide a valid JSON object with name, department, designation, and salary.");
            return {
                status: 400,
                body: JSON.stringify({
                    message: 'Please provide all the required fields in the request body.',
                    statusCode: 400
                })
            };
        }
        
        const { resource: createdEmployee } = await cosmosDbService.container.items.create(employee);

        return {
            status: 200,
            body: JSON.stringify({
                message: "Employee " + createdEmployee.name + " added to the database",
                data: createdEmployee,
                statusCode: 200
            })
        }
    } catch (error) {
        return {
            status: 400,
            body: JSON.stringify({
                error: error,
                message: error.message,
                statusCode: error.statusCode
            })
        }
    }
};


app.http('createEmployee', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: createEmployee
});