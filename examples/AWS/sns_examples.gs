function listTopics() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";

  const tucuxiClient = new TucuxiSNS(awsKey, awsSecret);
  const response = tucuxiClient.listTopics();
  Logger.log(JSON.stringify(response));
}

function publishInTopic() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";

  const topicARN = "arn:aws:sns:us-east-1:USER_ID:tests";
  const tucuxiClient = new TucuxiSNS(awsKey, awsSecret);
  const response = tucuxiClient.publishMessage(
    topicARN,
    '{"message": "hello world!"}'
  );
  Logger.log(JSON.stringify(response));
}

function createTopic() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";
  const tucuxiClient = new TucuxiSNS(awsKey, awsSecret);
  const response = tucuxiClient.createTopic("tests");
  Logger.log(JSON.stringify(response));
}

function listSubscriptions() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";
  const tucuxiClient = new TucuxiSNS(awsKey, awsSecret);
  const response = tucuxiClient.listSubscriptions();
  Logger.log(JSON.stringify(response));
}

function unsubscribe() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";
  const tucuxiClient = new TucuxiSNS(awsKey, awsSecret);
  const response = tucuxiClient.unsubscribe(
    "arn:aws:sns:us-east-1:USER_ID:tests:SUBSCRIPTION_ID"
  );
  Logger.log(JSON.stringify(response));
}

function deleteTopic() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";

  const topicARN = "arn:aws:sns:us-east-1:USER_ID:tests";
  const tucuxiClient = new TucuxiSNS(awsKey, awsSecret);
  const response = tucuxiClient.deleteTopic(topicARN);
  Logger.log(JSON.stringify(response));
}

function batchPublishInTopic() {
  const awsKey = "AWS_KEY_ID";
  const awsSecret = "AWS_KEY_SECRET";

  const topicARN = "arn:aws:sns:us-east-1:USER_ID:tests";
  const tucuxiClient = new TucuxiSNS(awsKey, awsSecret);
  const response = tucuxiClient.publishMessageBatch(topicARN, [
    { text: '{"message": "hello world!"}', id: 1 },
    { text: '{"message": "hello world2!"}' },
  ]);
  Logger.log(JSON.stringify(response));
}
