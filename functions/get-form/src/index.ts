import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TErrorBody, TResultBody } from "./types";
import crypto from "node:crypto";
import {
  AttributeValue,
  DynamoDBClient,
  BatchGetItemCommand,
  BatchGetItemCommandInput
} from "@aws-sdk/client-dynamodb";

export const handler: (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const response = getForm()

    console.log(response)
    
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (err) {
    console.log(err); // Lambda will automatically log console.log() to cloudwatch

    const error: TErrorBody = {
      message: "An error occurred"
    };
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

const getForm = async () => {
  const input: BatchGetItemCommandInput = {
    RequestItems: {"reimbursement": {Keys: [{id: {S: ""}}]}}
  };

  const client = new DynamoDBClient({});
  const response = await client.send(new BatchGetItemCommand(input));
  client.destroy();
  return response;
};
