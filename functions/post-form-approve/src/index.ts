import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TErrorBody, TInputBody, TResultBody } from "./types";
import {
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemCommandInput
} from "@aws-sdk/client-dynamodb";

export const handler: (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Get request body
    const inputBody: TInputBody = JSON.parse(event?.body ?? "{}") as TInputBody;

    // Get id
    const id: string = event.pathParameters?.["id"] ?? "";
    console.log(`[post-form-approve] ID: ${id}`)

    // Update item
    await updateForm(id, inputBody);

    // Return result
    const resultBody: TResultBody = {
      approved: inputBody.approved
    };
    console.log(`[post-form-approve] Result: ${resultBody}`)
    return {
      statusCode: 200,
      headers:{"access-control-allow-origin":'*'},
      body: JSON.stringify(resultBody)
    };
  } catch (err) {
    console.log(err); // Lambda will automatically log console.log() to cloudwatch

    const error: TErrorBody = {
      message: "An error occurred"
    };
    return {
      statusCode: 500,
      headers:{"access-control-allow-origin":'*'},
      body: JSON.stringify(error)
    };
  }
};

const updateForm: (id: string, input: TInputBody) => Promise<void> = async (
  id: string,
  input: TInputBody
): Promise<void> => {
  const commandInput: UpdateItemCommandInput = {
    Key: {
      id: {
        S: id
      }
    },
    TableName: "reimbursement",
    UpdateExpression: `SET employeeSignOffDate = :employeeSignOffDate,
                           leadSignOffDate = :leadSignOffDate,
                           executiveSignOffDate = :executiveSignOffDate,
                           approved = :approved`,
    ExpressionAttributeValues: {
      ":employeeSignOffDate": {
        S: input.employeeSignOffDate
      },
      ":leadSignOffDate": {
        S: input.leadSignOffDate
      },
      ":executiveSignOffDate": {
        S: input.executiveSignOffDate
      },
      ":approved": {
        BOOL: input.approved
      }
    }
  };

  const command: UpdateItemCommand = new UpdateItemCommand(commandInput);
  const client = new DynamoDBClient({});
  await client.send(command);
  client.destroy();
};
