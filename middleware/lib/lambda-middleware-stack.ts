import { Construct } from 'constructs';
import { aws_lambda as lambda, aws_apigateway as apigw, Stack, StackProps } from 'aws-cdk-lib';
import * as dotenv from 'dotenv';

dotenv.config();

export class IntercomLambdaMiddlewareStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new IntercomMiddelWare(this, 'intercom-middleware');
  }
}

class IntercomMiddelWare extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const handler = new lambda.Function(this, 'intercom-middelware-lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./packages/functions'), // this path is relative to the project root
      handler: 'index.handler',
    });

    handler.addEnvironment('INTERCOM_API_KEY', process.env.INTERCOM_API_KEY!);

    const api = new apigw.RestApi(this, 'intercom-middleware-apigw');

    const hookTarget = api.root.addResource('intercom');
    hookTarget.addMethod('POST', new apigw.LambdaIntegration(handler));
  }
}