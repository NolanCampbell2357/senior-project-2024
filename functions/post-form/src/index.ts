import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TErrorBody, TForm, TInputBody } from "./types";
import crypto from "node:crypto";
import { marshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput
} from "@aws-sdk/client-dynamodb";

export const handler: (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    let id: string = "";
    if (event.pathParameters && event.pathParameters["id"]) {
      id = event.pathParameters["id"];
    } else if (event.path === "/form") {
      id = crypto.randomUUID();
    } else {
      console.log(`Unknown event: ${JSON.stringify(event, null, 1)}`);

      const error: TErrorBody = {
        message: "Invalid Call"
      };
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      };
    }

    console.log(`POST /form with id ${id}`);

    const inputBody: TInputBody = JSON.parse(event?.body ?? "{}") as TInputBody;
    const updateForm: TForm = {
      ...inputBody,
      id
    };

    await putForm(updateForm);

    return {
      statusCode: 200,
      body: JSON.stringify(updateForm)
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

const putForm: (form: TForm) => Promise<void> = async (
  form: TForm
): Promise<void> => {
  const marshallOptions: marshallOptions = {
    removeUndefinedValues: true
  };

  const marshalledItem: Record<string, AttributeValue> = marshall(
    form,
    marshallOptions
  );

  const input: PutItemCommandInput = {
    TableName: "reimbursement",
    Item: marshalledItem
  };

  const command: PutItemCommand = new PutItemCommand(input);
  const client = new DynamoDBClient({});
  await client.send(command);
  client.destroy();
};
