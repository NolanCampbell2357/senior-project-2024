const git = require("./git");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");
const zip = require("./zip");
const aws_lambda = require("./aws-lambda");

module.exports = {
  removeOldFolders: (functionName, functionsRoot) => {
    console.log(`Removing old folders for ${functionName}`);

    const buildFolder = path.resolve(functionsRoot, functionName, "build");
    if (fs.existsSync(buildFolder)) {
      fs.rmSync(buildFolder, { force: true, recursive: true });
    }

    const minifyFolder = path.resolve(functionsRoot, functionName, "minify");
    if (fs.existsSync(minifyFolder)) {
      fs.rmSync(minifyFolder, { force: true, recursive: true });
    }

    const distFolder = path.resolve(functionsRoot, functionName, "dist");
    if (fs.existsSync(distFolder)) {
      fs.rmSync(distFolder, { force: true, recursive: true });
    }
  },
  buildFunction: (functionName, functionsRoot) => {
    console.log(`Building Function ${functionName}`);

    const tsconfigPath = path.resolve(functionsRoot, "tsconfig.json");
    const tsconfig = require(tsconfigPath);

    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify(
        {
          ...tsconfig,
          include: [
            `${path.resolve(functionsRoot, functionName, "src", "**", "*")}`
          ],
          compilerOptions: {
            ...tsconfig.compilerOptions,
            outDir: path.resolve(functionsRoot, functionName, "build", "src")
          }
        },
        null,
        1
      )
    );

    childProcess.execSync("npx tsc --project tsconfig.json", {
      cwd: functionsRoot,
      stdio: "inherit"
    });

    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 1));
  },
  minifyFunction: async (functionName, functionsRoot) => {
    console.log(`Minifying Function ${functionName}`);

    let functionBuildIndexPath = path.resolve(
      functionsRoot,
      functionName,
      "build",
      "src",
      "index.js"
    );

    let functionBuildMinifyIndexPath = path.resolve(
      functionsRoot,
      functionName,
      "build",
      "minify",
      "index.js"
    );

    childProcess.execSync(
      `npx rollup --silent --config ${path.resolve(functionsRoot, "rollup.config.js")} --input ${functionBuildIndexPath} --file ${functionBuildMinifyIndexPath}`,
      {
        cwd: functionsRoot,
        stdio: "inherit"
      }
    );
  },
  zipFunction: async (functionName, functionsRoot) => {
    console.log(`Zipping Function ${functionName}`);

    const sourceFolder = path.resolve(
      functionsRoot,
      functionName,
      "build",
      "minify"
    );

    const distFolder = path.resolve(
      functionsRoot,
      functionName,
      "build",
      "dist"
    );

    fs.mkdirSync(distFolder);
    const distFile = path.resolve(distFolder, `${functionName}.zip`);
    await zip.zipFolder(sourceFolder, distFile, "**/!(*.map)");
  },
  deployFunctionCode: async (functionName, functionsRoot) => {
    console.log(`Deploying function code for ${functionName}`);
    let functionBuildPath = path.resolve(functionsRoot, functionName, "build");

    const zipFilePath = path.resolve(
      functionBuildPath,
      "dist",
      `${functionName}.zip`
    );

    const updateFunctionCodeOutput = await aws_lambda.updateFunctionCode(
      functionName,
      zipFilePath
    );
  },
  deletePreviousVersions: async (functionName) => {
    console.log(`Deleting previous versions for ${functionName}`);

    const functionVersions = await aws_lambda.getFunctionVersions(functionName);

    const deleteVersions = functionVersions.Versions.filter(
      (x) => x.Version != "$LATEST"
    ).map((x) => x.Version);
    const deleteVersion = await aws_lambda.deleteVersions(
      functionName,
      deleteVersions
    );
  }
};
