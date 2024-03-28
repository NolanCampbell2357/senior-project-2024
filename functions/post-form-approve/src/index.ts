import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TErrorBody, TForm, TInputBody, TResultBody } from "./types";
import { marshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
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
    
    // Update item
    updateForm(inputBody); // TODO: Implement this function

    // Return result
    const resultBody: TResultBody = {
      approved: inputBody.approved
    }
    return {
      statusCode: 200,
      body: JSON.stringify(resultBody)
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

const updateForm: (id: string, input: TInputBody) => Promise<void> = async (
  id: string, input: TInputBody
): Promise<void> => {
  const marshallOptions: marshallOptions = {
    removeUndefinedValues: true
  };

  const marshalledItem: Record<string, AttributeValue> = marshall(
    input,
    marshallOptions
  );

  // TODO: Landon, this is what you need to finish implementing
  // Should update the fields that are listed in the TInputBody types
 // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/UpdateItemCommand/
  const commandInput: UpdateItemCommandInput = {
    TableName: "reimbursement",
  };

  const command: UpdateItemCommand = new UpdateItemCommand(commandInput);
  const client = new DynamoDBClient({});
  await client.send(command);
  client.destroy();
};
