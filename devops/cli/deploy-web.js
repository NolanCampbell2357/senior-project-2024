const git = require("../modules/git");
const path = require("node:path");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const awsS3 = require("../modules/aws-s3");

const getConfiguration = () => {
  const gitRoot = git.getGitRoot();
  const webRoot = path.resolve(gitRoot, "web");

  return {
    gitRoot,
    webRoot,
    bucketName: "rsp-web"
  };
};

const buildWeb = (configuration) => {
  console.log("Spawning web build script...");

  childProcess.execSync("npx ng build", {
    cwd: configuration.webRoot,
    stdio: "inherit"
  });
};

const deployWeb = async (configuration) => {
  console.log("Deploying web to S3");

  const uploadRoot = path.resolve(
    configuration.webRoot,
    "dist",
    "web",
    "browser"
  );

  const deployPaths = [];

  const listContents = (relativePath) => {
    const listPath = path.resolve(uploadRoot, relativePath);
    fs.readdirSync(listPath, { withFileTypes: true }).forEach((x) => {
      if (x.isDirectory()) {
        listContents(path.join(relativePath, x.name));
      } else {
        deployPaths.push(path.normalize(path.join(relativePath, x.name)));
      }
    });
  };

  listContents("./");

  console.log("Deleting old files in S3");
  const deleteObjects = await awsS3.listObjects(configuration.bucketName);
  if (!!deleteObjects) {
    const deletePaths = deleteObjects.map((x) => x.Key);
    await awsS3.deleteObjects(configuration.bucketName, deletePaths);
  }

  console.log("Uploading new files to S3");
  await awsS3.putObjects(configuration.bucketName, uploadRoot, deployPaths);
};

(async () => {
  console.log("====================");
  console.log("Deploy web");

  const configuration = getConfiguration();
  buildWeb(configuration);
  await deployWeb(configuration);

  console.log("====================");
})();
