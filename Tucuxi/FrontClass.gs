class NotImplementedError extends ReferenceError { };
class ServiceNotSetError extends ReferenceError { };

function Tucuxi(service, aws_key, aws_skey, region="us-east-1"){
  const mapping = {
    "s3": TucuxiS3,
    "sns": TucuxiSNS
  };

  const normalizedService = service.toLower();
  const identifiedClass =  mapping[normalizedService];

  if(identifiedClass === undefined){
    if(service !== undefined)
      throw new NotImplementedError(`The service ${service} wasn't implemented yet!`);
    else
      throw new ServiceNotSetError("The service name is required for that application!");
  }

  return new identifiedClass(aws_key, aws_skey, region);
}