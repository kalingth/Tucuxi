function sendFileToS3() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";
  const bucket = "kalingth";
  const body = JSON.stringify({ hello: "world" });
  const key = "tests/hello.json";
  const contentType = "application/json";

  const tucuxiClient = new TucuxiS3(awsKey, awsSecret);
  const response = tucuxiClient.uploadFileToS3(bucket, key, body, contentType);
  Logger.log(response);
}

function getFileFromS3() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";
  const bucket = "kalingth";
  const key = "tests/hello.json";

  const tucuxiClient = new TucuxiS3(awsKey, awsSecret);
  const file = tucuxiClient.getFileFromS3(bucket, key);
  Logger.log(file.getContentText());
}

function copyFileFromS3() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";
  const bucket = "kalingth";
  const key = "tests/hello.json";
  const newKey = "tests/hello2.json";

  const tucuxiClient = new TucuxiS3(awsKey, awsSecret);
  const file = tucuxiClient.copyFileFromS3(bucket, key, bucket, newKey);
  Logger.log(file.getContentText());
}

function getFilesFromS3() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";
  const bucket = "kalingth";

  const tucuxiClient = new TucuxiS3(awsKey, awsSecret);
  const file = tucuxiClient.listFilesFromS3(bucket, "tests");
  Logger.log(JSON.stringify(file));
}

function listBucketsFromS3() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";

  const tucuxiClient = new TucuxiS3(awsKey, awsSecret);
  const file = tucuxiClient.listBucketsFromS3();
  Logger.log(JSON.stringify(file));
}

function deleteFileFromS3() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";
  const bucket = "kalingth";
  const key = "tests/hello.json";

  const tucuxiClient = new TucuxiS3(awsKey, awsSecret);
  const file = tucuxiClient.deleteFileFromS3(bucket, key);
  Logger.log(file.getContentText());
}
