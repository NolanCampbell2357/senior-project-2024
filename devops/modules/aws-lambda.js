const {
  LambdaClient,
  GetFunctionConfigurationCommand,
  UpdateFunctionCodeCommand,
  ListVersionsByFunctionCommand,
  DeleteFunctionCommand
} = require("@aws-sdk/client-lambda");
const fs = require("node:fs/promises");

module.exports = {
  getFunctionConfiguration: async (functionName) => {
    const clientConfiguration = {};
    const client = new LambdaClient(clientConfiguration);

    const getFunctionConfigurationCommandInput = {
      FunctionName: functionName
    };

    const getFunctionConfigurationCommand = new GetFunctionConfigurationCommand(
      getFunctionConfigurationCommandInput
    );
    const functionConfigurationCommandOutput = await client.send(
      getFunctionConfigurationCommand
    );

    return functionConfigurationCommandOutput;
  },
  getFunctionVersions: async (functionName) => {
    const clientConfiguration = {};
    const client = new LambdaClient(clientConfiguration);

    const listVersionsByFunctionsCommandInput = {
      FunctionName: functionName
    };

    const listVersionsByFunctionCommand = new ListVersionsByFunctionCommand(
      listVersionsByFunctionsCommandInput
    );

    const listVersionsByFunctionCommandOutput = await client.send(
      listVersionsByFunctionCommand
    );
    return listVersionsByFunctionCommandOutput;
  },
  deleteVersions: async (functionName, versions) => {
    const clientConfiguration = {};
    const client = new LambdaClient(clientConfiguration);

    const deleteFunctionCommandOutputs = [];

    for (const version in versions) {
      const deleteFunctionCommandInput = {
        FunctionName: functionName,
        Qualifier: version
      };
      const deleteFunctionCommand = new DeleteFunctionCommand(
        deleteFunctionCommandInput
      );
      const deleteFunctionCommandOutput = await client.send(
        deleteFunctionCommand
      );
      deleteFunctionCommandOutputs.push(deleteFunctionCommandOutput);
    }
    return deleteFunctionCommandOutputs;
  },
  updateFunctionCode: async (functionName, zipFilePath) => {
    const clientConfiguration = {};
    const client = new LambdaClient(clientConfiguration);

    const fileBytes = await fs.readFile(zipFilePath);

    let loopCount = 5;
    let functionConfiguration = await getFunctionConfiguration(functionName);

    while (
      functionConfiguration.LastUpdateStatus !== "Successful" &&
      loopCount-- > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      functionConfiguration = await getFunctionConfiguration(functionName);
    }

    const updateFunctionCodeCommandInput = {
      FunctionName: functionName,
      ZipFile: fileBytes,
      Publish: true
    };

    const updateFunctionCodeCommand = new UpdateFunctionCodeCommand(
      updateFunctionCodeCommandInput
    );

    const updateFunctionCodeCommandOutput = await client.send(
      updateFunctionCodeCommand
    );
    return updateFunctionCodeCommandOutput;
  }
};
