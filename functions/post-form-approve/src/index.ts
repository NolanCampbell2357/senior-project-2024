import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TErrorBody, TResultBody } from "./types";
const url = "https://aws.amazon.com/";
export const handler: (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const res: Response = await fetch(url);

    const body: TResultBody = {
      message: await res.text()
    };

    return {
      statusCode: res.status,
      body: JSON.stringify(body)
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
