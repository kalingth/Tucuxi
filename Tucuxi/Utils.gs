/**
 * Converts XML data to JSON format.
 * It first parses the XML data using the XmlService and retrieves the root element.
 * The root element is then passed to elementToJson function which returns the resulting JSON.
 * If there is an error during parsing, it throws an error.
 * 
 * @param  {string} xml A string that contains the XML that you want to parse.
 * @returns {Object} A parsed object.
 */
function xmlToJson(xml) {
  try {
    const doc = XmlService.parse(xml);
    const root = doc.getRootElement();
    return elementToJson(root);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to parse XML to JSON.");
  }
}

/**
 * Converts a single XML element to JSON format.
 * It initializes an empty object result to store the JSON data.
 * The function then iterates over the element's attributes and stores each attribute name-value pair in the result object.
 * Next, the function iterates over the children elements of the element and converts each child to JSON format and adds it to the result object.
 * If the element has text, the text is stored in result as value.
 * Finally, if the length of the result object is 1 and value exists, result is set to value.
 * 
 * @param {Document} element A parsed XML document.
 * @returns {Object} A parsed object.
 */
function elementToJson(element) {
  let result = {};

  element.getAttributes().forEach((attribute) => {
    const name = attribute.getName();
    const value = attribute.getValue();

    result[name] = value;
  });

  element.getChildren().forEach((child) => {
    const key = child.getName();
    const value = elementToJson(child);

    if (result[key]) {
      if (!Array.isArray(result[key])) 
        result[key] = [result[key]];
      result[key].push(value);
    } else {
      result[key] = value;
    }
  });

  if (element.getText())
    result.value = element.getText();

  if(Object.keys(result).length == 1 && result.value !== undefined)
    result = result.value;
  else
    delete result.value;

  return result;
}

/**
 * Converts a byte array to its hexadecimal string representation.
 * It maps each byte in the byte array to its hexadecimal string representation and concatenates all strings to form a single string.
 * 
 * @param {Byte[]} byteArr An array filled with bytes for digest.
 * @returns {string} The hexdigested string.
 */
function hexDigest(byteArr) {
  const hexString = byteArr.map(
    byte => {
      var v = (byte < 0) ? 256 + byte : byte;
      return ("0" + v.toString(16)).slice(-2);
    }
  ).join("");
  return hexString;
}

/**
 * Computes an HMAC signature using SHA-256 hash algorithm.
 * It first computes the HMAC signature of timestamp using the key AWS4${context.awsSecret}.
 * Then, it computes the HMAC signature of the region, service and request string using the intermediate keys computed in the previous steps.
 * Finally, it returns the hexadecimal string representation of the HMAC signature of the stringToSign.
 * 
 * @param {string} stringToSign The string that you want to sign.
 * @param {string} timestamp The request date.
 * @param {Object} context The context of the request.
 * @returns {string} SHA-256 hex digested signature.
 */
function signature(stringToSign, timestamp, context){
  const kDate = Utilities.computeHmacSha256Signature(timestamp, `AWS4${context.awsSecret}`);

  const bytesRegion = Utilities.newBlob(context.region).getBytes();
  const region = Utilities.computeHmacSha256Signature(bytesRegion, kDate);
  const bytesService = Utilities.newBlob(context.service).getBytes();
  const service = Utilities.computeHmacSha256Signature(bytesService, region);
  const bytesToken = Utilities.newBlob("aws4_request").getBytes();
  const token = Utilities.computeHmacSha256Signature(bytesToken, service);
  const bytesStringToSign = Utilities.newBlob(stringToSign).getBytes();
  const signedToken = Utilities.computeHmacSha256Signature(bytesStringToSign, token);
  return hexDigest(signedToken)
}


/**
 * Returns authentication headers to be added to a request.
 * It parses the uri to extract the host, path and parameters.
 * Then, it sets the date and compute the body hash.
 * The function then computes the canonical request string, its digest and the string to sign.
 * Finally, it computes the HMAC signature and returns the authentication headers including content type, date, body hash, and the authorization header with the computed signature.
 * 
 * @param {string} method - The request method (e.g. 'GET', 'POST')
 * @param {string} uri - The URI of the request
 * @param {Object} context - The context object that contains the following properties:
 *   - {string} awsKey - The AWS access key
 *   - {string} region - The AWS region
 *   - {string} service - The AWS service
 * @param {string} [contentType="application/json"] - The content type of the request body
 * @param {string} [body=""] - The request body
 * 
 * @returns {Object} - Returns an object that represents the headers of the request with the AWS signature.
 */
function getAuthHeaders(method, uri, context, contentType="application/json", body=""){
  const parsedUri = uri.match(/^https?:\/\/(?<host>[^\/]+)(?<path>[^\?]+)?(\?(?<parameters>.+))?$/).groups;
  const host = parsedUri.host;
  const path = parsedUri.path || "/";
  const parameters = parsedUri.parameters || "";


  const now = new Date();
  const amzDate = now.toISOString().replaceAll(/\-|:|\.\d+/g, "");
  const date = amzDate.replaceAll(/T.*/g, "");

  const bodyHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, body);
  const bodyHashDigest = hexDigest(bodyHash);
  const canonical = `${method}\n${path}\n${parameters}\ncontent-type:${contentType}\nhost:${host}\nx-amz-date:${amzDate}\n\ncontent-type;host;x-amz-date\n${bodyHashDigest}`;
  const canonicalDigest = hexDigest(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, canonical));
  const credential = `${date}/${context.region}/${context.service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credential}\n${canonicalDigest}`;
  const signedToken = signature(stringToSign, date, context);

  const headers = {
    "Content-Type": contentType,
    "X-Amz-Date": amzDate,
    "X-Amz-Content-Sha256": bodyHashDigest,
    "Authorization": `AWS4-HMAC-SHA256 Credential=${context.awsKey}/${date}/${context.region}/${context.service}/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=${signedToken}`
  }

  return headers;
}

/**
 * performRequest is a function that performs an HTTP request using the given method, uri, headers and body.
 *
 * @param {string} method - The HTTP request method, such as GET, POST, etc.
 * @param {string} uri - The URI of the target resource to be accessed.
 * @param {Object} headers - An object representing the request headers.
 * @param {string} [body=""] - The request body, optional.
 * @return {Object} response - The response object, which can be used to access the response data.
 */
function performRequest(method, uri, headers, body=""){
  const parameters = {
    "payload": body,
    "method": method,
    "headers": headers,
    'muteHttpExceptions': true
  };
  const response = UrlFetchApp.fetch(uri, parameters);
  return response;
}