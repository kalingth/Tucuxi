class TucuxiSNS {

  constructor(aws_key, aws_skey, region="us-east-1"){
    this.service = "sns";
    this.awsKey = aws_key;
    this.awsSecret = aws_skey;
    this.region = region;
  }

  /**
   * This function is used to create a new Amazon SNS topic.
   * 
   * @param {string} topicName (required): the name of the new topic to create.
   * @returns {Object} The function returns the JSON representation of the response obtained from Amazon SNS after creating the topic.
   */
  createTopic(topicName){
    const method = "POST";
    const contentType = "application/x-www-form-urlencoded; charset=utf-8";
    const uri = `https://sns.${this.region}.amazonaws.com/`;
    const body = `Action=CreateTopic&Name=${topicName}&Version=2010-03-31`;

    const headers = getAuthHeaders(method, uri, this, contentType, body);
    const response = performRequest(method, uri, headers, body);

    return xmlToJson(response.getContentText());
  }

  /**
   * Lists all Amazon SNS topics in a specified region.
   * 
   * @return {Object} - An object representation of the XML response, converted to JSON format.
   */
  listTopics(){
    const method = "GET";
    const contentType = "application/x-www-form-urlencoded; charset=utf-8";
    const uri = `https://sns.${this.region}.amazonaws.com/?Action=ListTopics&Version=2010-03-31`;

    const headers = getAuthHeaders(method, uri, this, contentType);
    const response = performRequest(method, uri, headers);
    return xmlToJson(response.getContentText());
  }

  /**
   * Deletes an SNS topic from Amazon Web Services (AWS).
   * 
   * @param {string} topicARN - The Amazon Resource Name (ARN) of the topic to be deleted.
   * @return {Object} - A JSON object representing the response from AWS.
   */
  deleteTopic(topicARN){
    const method = "POST";
    const contentType = "application/x-www-form-urlencoded; charset=utf-8";
    const uri = `https://sns.${this.region}.amazonaws.com/`;
    const body = `Action=DeleteTopic&TopicArn=${topicARN}&Version=2010-03-31`;

    const headers = getAuthHeaders(method, uri, this, contentType, body);
    const response = performRequest(method, uri, headers, body);

    return xmlToJson(response.getContentText());
  }

  /**
   * Publish a message to a topic in Amazon SNS
   * 
   * @param {string} topicARN - The ARN of the topic to which the message will be published.
   * @param {string} message - The message to be published to the topic.
   * @return {Object} Returns the response from the Amazon SNS service in JSON format.
   */
  publishMessage(topicARN, message){
    const method = "POST";
    const contentType = "application/x-www-form-urlencoded; charset=utf-8";
    const uri = `https://sns.${this.region}.amazonaws.com/`;
    const body = `Action=Publish&TopicArn=${topicARN}&Message=${message}&Version=2010-03-31`;
    const headers = getAuthHeaders(method, uri, this, contentType, body);
    const response = performRequest(method, uri, headers, body);
    return xmlToJson(response.getContentText());
  }

  /**
   * List subscriptions of SNS topic.
   * 
   * @param {string} [nextToken=""] - Token to retrieve next page of results.
   * @param {string} [topicARN=""] - ARN of the topic. If not specified, all subscriptions will be listed.
   * 
   * @returns {Object} - Result in JSON format, including the subscriptions.
   */  
  listSubscriptions(nextToken="", topicARN=""){
    const method = "POST";
    const contentType = "application/x-www-form-urlencoded; charset=utf-8";
    const uri = `https://sns.${this.region}.amazonaws.com/`;
    if(topicARN === "")
      var body = `Action=ListSubscriptions&NextToken=${nextToken}&Version=2010-03-31`;
    else
      var body = `Action=ListSubscriptionsByTopic&NextToken=${nextToken}&TopicArn=${topicARN}&Version=2010-03-31`;
    const headers = getAuthHeaders(method, uri, this, contentType, body);
    const response = performRequest(method, uri, headers, body);
    return xmlToJson(response.getContentText());
  }

  /**
   * This function makes an HTTP POST request to unsubscribe a specific subscription from a topic in Amazon Simple Notification Service (SNS).
   * 
   * @param {String} subscribeARN The Amazon Resource Name (ARN) of the subscription to be unsubscribed.
   * @returns {Object} - Returns the response from Amazon SNS in JSON format, after converting it from XML.
   */
  unsubscribe(subscribeARN){
    const method = "POST";
    const contentType = "application/x-www-form-urlencoded; charset=utf-8";
    const uri = `https://sns.${this.region}.amazonaws.com/`;
    const body = `Action=Unsubscribe&SubscriptionArn=${subscribeARN}&Version=2010-03-31`;
    const headers = getAuthHeaders(method, uri, this, contentType, body);
    const response = performRequest(method, uri, headers, body);
    return xmlToJson(response.getContentText());
  }

  /**
   * This function is used to publish a batch of messages to a specified Amazon Simple Notification Service (SNS) topic.
   * 
   * @param {string} topicARN The Amazon Resource Name (ARN) of the SNS topic.
   * @param {Array} messages An array of messages to be published. Each object in the array should contain a text property that specifies the message text, and an optional id property that specifies a unique identifier for the message. If the id property is not provided, a unique identifier will be generated using the Utilities.getUuid() method.
   * @returns The function returns the result of the batch message publishing request as a JavaScript object that has been converted from XML to JSON format using the xmlToJson function.
   */
  publishMessageBatch(topicARN, messages){
    const method = "POST";
    const contentType = "application/x-www-form-urlencoded; charset=utf-8";
    const uri = `https://sns.${this.region}.amazonaws.com/`;
    let batchParams = "";
    for(let i = 0; i < messages.length; i++){
      let message = messages[i];
      let message_text = message.text;
      let id = message.id || Utilities.getUuid();
      batchParams += `PublishBatchRequestEntries.member.${i + 1}.Message=${message_text}&PublishBatchRequestEntries.member.${i + 1}.Id=${id}&`;
    };
    const body = `Action=PublishBatch&TopicArn=${topicARN}&${batchParams}Version=2010-03-31`;
    const headers = getAuthHeaders(method, uri, this, contentType, body);
    const response = performRequest(method, uri, headers, body);
    return xmlToJson(response.getContentText());
  }

}