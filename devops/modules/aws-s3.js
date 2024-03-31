const path = require("node:path");
const fs = require("node:fs");
const {
  S3Client,
  DeleteObjectsCommand,
  PutObjectCommand,
  ListObjectsV2Command
} = require("@aws-sdk/client-s3");

const deleteObjects = async (bucket, objectPaths) => {
  objectPaths.map((x) => console.log(`Delete ${x} from ${bucket}`));

  const client = new S3Client({});

  const input = {
    Bucket: bucket,
    Delete: {
      Objects: objectPaths.map((x) => {
        return { Key: x };
      })
    }
  };

  const command = new DeleteObjectsCommand(input);
  const response = await client.send(command);
  client.destroy();
  return response;
};

const putObjects = async (bucket, rootPath, objectPaths) => {
  const client = new S3Client({});

  const getContentType = (fileName) => {
    switch (fileName.split(".").slice(-1)[0].toLowerCase()) {
      case "css":
        return "text/css";
      case "js":
        return "text/javascript";
      case "ico":
        return "image/x-icon";
      case "html":
        return "text/html";
      case "png":
        return "image/png";
      case "svg":
        return "image/svg+xml";
      case "zip":
        return "application/zip";
      case "txt":
      case "text":
        return "text/plain";
      default:
        return "application/octet-stream";
    }
  };

  const promises = objectPaths.map((x) => {
    console.log(
      `PUT ${x.split("\\").join("/")} as ${getContentType(x)} to ${bucket}`
    );

    const body = fs.readFileSync(path.resolve(rootPath, x));
    const input = {
      Bucket: bucket,
      Key: x.split("\\").join("/"),
      ContentType: getContentType(x),
      Body: body
    };

    const command = new PutObjectCommand(input);
    return client.send(command);
  });

  client.destroy();
  return Promise.all(promises);
};

const listObjects = async (bucket) => {
  const client = new S3Client({});
  const input = {
    Bucket: bucket
  };
  const command = new ListObjectsV2Command(input);
  const response = await client.send(command);
  client.destroy();
  return response.Contents;
};

module.exports = {
  deleteObjects,
  putObjects,
  listObjects
};
