import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TErrorBody, TResultBody } from "./types";
import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";

export const handler: (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const response = await getForm()

    console.log("INFO, get-form returned: ", JSON.stringify(response))
    
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
  const input: ScanCommandInput = {
    TableName: "reimbursement"
  };

  const client = new DynamoDBClient({});
  const response = await client.send(new ScanCommand(input));
  client.destroy();
  return response;
};
