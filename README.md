# Tucuxi :dolphin:

Tucuxi is a project that enables you to consume AWS APIs using Google Workspace Apps Script. It provides a simple, programmatic interface to Amazon S3 and Amazon SNS, two of the most commonly used AWS services.

Tucuxi is a AppsScript-based project that builds upon the foundation of Boto3, the AWS SDK for Python. Just like the Amazon river dolphin it is named after, Tucuxi is a nimble and versatile solution for integrating your AppsScript applications with AWS services. While both Boto3 and Tucuxi share the goal of providing a simple and powerful way to interact with AWS, Tucuxi brings its own unique set of features and benefits to the table. With a focus on streamlined syntax and increased support for AppsScript, Tucuxi makes it easy for developers to get started with AWS, regardless of their background or experience. Whether you're building a serverless architecture, automating cloud deployments, or just need to store and retrieve data from the cloud, Tucuxi has got you covered. So dive into the deep blue with Tucuxi and experience the power of AWS like never before!

## S3 Class

The S3Class.gs file contains the TucuxiS3 class, which provides the following functions for interacting with Amazon S3

 uploadFileToS3: This function uploads a file to a specified S3 bucket. It takes the following parameters:
    - bucket: The name of the S3 bucket to upload the file to.
    - filename: The name of the file to upload.
    - body: The contents of the file to upload.
    - contentType: The MIME type of the contents of the file (default is "application/json").
- getFileFromS3: This function retrieves a file from a specified S3 bucket. It takes the following parameters:
    - bucket: The name of the S3 bucket to retrieve the file from.
    - key: The key (file path) of the file to retrieve.
- listFilesFromS3: This function retrieves a list of files from a specifiedS3 bucket. It takes the following parameters:
    - bucket: The name of the S3 bucket to retrieve the files from.
    - prefix: An optional prefix for filtering the list of files to retrieve.
- listBucketsFromS3: This function retrieves a list of all available S3buckets.
- deleteFileFromS3: This function deletes a file from a specified S3 bucket. It takes the following parameters:
    - bucket: The name of the S3 bucket to delete the file from.
    - key: The key (file path) of the file to delete.

## SNS Class

The SNSClass.gs file contains the TucuxiSNS class, which provides the following functions for interacting with Amazon SNS:

- createTopic: This function creates a new Amazon SNS topic. It takes the following parameters:
    - topicName: The name of the new SNS topic.
- publishToTopic: This function publishes a message to a specified SNS topic. It takes the following parameters:
    - topicArn: The ARN of the SNS topic to publish the message to.
    - message: The message to publish to the SNS topic.
- listTopics: This function retrieves a list of all available SNS topics.
- deleteTopic: This function deletes an SNS topic. It takes the following parameter:
    - topicArn: The ARN of the SNS topic to delete.

## Usage

In order to use Tucuxi, you need to provide your AWS credentials (AWS access key and secret key) and the region you want to operate in. The region is optional and defaults to "us-east-1".

Here is an example of how to use Tucuxi to upload a file to an S3 bucket:

```javascript

const awsKey = "";
const awsSecret = "";

function sendFileToS3(){
    const bucketName = "kalingth";
    const filename = "HelloWorld.json";
    const fileBody = '{"Text": "Hello World!"}';

    const tucuxi = new TucuxiS3(awsKey, awsSecret);
    const response = tucuxi.uploadFileToS3(bucketName, filename, fileBody);
    Logger.log(response);
}
```

You can use a most friendly integration to make your requests. Here is an exemple:

```javascript

const awsKey = "";
const awsSecret = "";

function sendFileToS3(){
    const bucketName = "kalingth";
    const filename = "HelloWorld.json";
    const fileBody = '{"Text": "Hello World!"}';

    const tucuxi = Tucuxi("s3", awsKey, awsSecret);
    const response = tucuxi.uploadFileToS3(bucketName, filename, fileBody);
    Logger.log(response);
}
```