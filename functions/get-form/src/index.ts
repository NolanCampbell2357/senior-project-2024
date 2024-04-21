import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TErrorBody } from "./types";
import {
  AttributeValue,
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import { TForm } from "./types/TForm";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler: (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const response: TForm[] = await getForm();

    console.log("INFO, get-form returned: ", JSON.stringify(response));

    return {
      statusCode: 200,
      headers:{"access-control-allow-origin":'*'},
      body: JSON.stringify(response)
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

const getForm: () => Promise<TForm[]> = async (): Promise<TForm[]> => {
  const input: ScanCommandInput = {
    TableName: "reimbursement"
  };

  const client = new DynamoDBClient({});
  const response: ScanCommandOutput = await client.send(new ScanCommand(input));
  client.destroy();

  if (!response.Items) {
    return [] as TForm[];
  }

  const forms: TForm[] = response.Items.map(
    (item: Record<string, AttributeValue>): TForm => {
      return unmarshall(item) as TForm;
    }
  );
  return forms;
};
