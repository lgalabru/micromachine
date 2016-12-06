const Service = require('rfr')('lib/service').default;
const AWSLambda = require('rfr')('lib/runtimes/aws_lambda').default;
const HTTPEndpoint = require('rfr')('lib/runtimes/http_endpoint').default;

export { Service };
export { HTTPEndpoint, AWSLambda };
