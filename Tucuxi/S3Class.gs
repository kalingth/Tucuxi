class TucuxiS3 {

  constructor(aws_key, aws_skey, region="us-east-1"){
    this.awsKey = aws_key;
    this.awsSecret = aws_skey;
    this.region = region;
    this.service = "s3";
  }

  /**
   * Upload a file to Amazon S3 bucket
   * 
   * @param {string} bucket - The S3 bucket name to upload the file
   * @param {string} filename - The name of the file to upload
   * @param {string} body - The contents of the file to upload
   * 
   * @return {Object} The response object returned by Amazon S3 
   */
  uploadFileToS3(bucket, filename, body){
    const contentType = "application/octet-stream"
    const method = "PUT";
    const uri = `https://${bucket}.s3.amazonaws.com/${filename}`;
    body = Utilities.newBlob(body, contentType).getBytes();
    const headers = getAuthHeaders(method, uri, this, contentType, body);
    return performRequest(method, uri, headers, body);
  }

  /**
   * This function retrieves a file from an Amazon S3 bucket.
   * 
   * @param {string} bucket The name of the S3 bucket where the file is located.
   * @param {string} key The key (file path) of the file to be retrieved.
   * @returns {Object} The function returns the file retrieved from the S3 bucket.
   */
  getFileFromS3(bucket, key) {    
    const method = "GET";
    const contentType = "application/json";
    const uri = `https://${bucket}.s3.amazonaws.com/${key}`;
    const headers = getAuthHeaders(method, uri, this, contentType);
    return performRequest(method, uri, headers);
  }

  /**
   * Function to retrieve a list of files from an S3 bucket.
   * 
   * @param {string} bucket - The name of the S3 bucket.
   * @param {string} prefix - The prefix for the files you want to retrieve (optional).
   * @return {Object} An object representing the list of files from the S3 bucket.
   */
  listFilesFromS3(bucket, prefix="") {    
    const method = "GET";
    const contentType = "application/json";
    const uri = `https://s3.amazonaws.com/${bucket}?prefix=${prefix}`;
    const headers = getAuthHeaders(method, uri, this, contentType);
    const response = performRequest(method, uri, headers);
    return xmlToJson(response.getContentText());
  }

  /**
   * This function retrieves the list of all available Amazon S3 buckets.
   * 
   * @returns A JavaScript object representing the response in JSON format, containing the list of all buckets in Amazon S3.
   */
  listBucketsFromS3() {    
    const method = "GET";
    const contentType = "application/json";
    const uri = `https://s3.amazonaws.com/`;
    const headers = getAuthHeaders(method, uri, this, contentType);
    const response = performRequest(method, uri, headers);
    return xmlToJson(response.getContentText());
  }

  /**
   * This function allows you to delete a file from an Amazon S3 bucket.
   * 
   * @param {string} bucket the name of the S3 bucket from which you want to delete the file.
   * @param {string} key The key (file path) of the file you want to delete.
   * @returns {Object} This function returns the result of performRequest function, which makes the actual HTTP request to delete the file from the S3 bucket.
   */
  deleteFileFromS3(bucket, key) {
    const method = "DELETE";
    const contentType = "application/json";
    const uri = `https://${bucket}.s3.amazonaws.com/${key}`;
    const headers = getAuthHeaders(method, uri, this, contentType);
    return performRequest(method, uri, headers);
  }

}