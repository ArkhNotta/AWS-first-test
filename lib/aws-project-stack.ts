import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Aws, aws_dynamodb, aws_s3, aws_sns_subscriptions, aws_sns} from "aws-cdk-lib";
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {handler} from "../source/functions";
import * as path  from "node:path";
import {SubscriptionProtocol, Topic} from "aws-cdk-lib/aws-sns";
import { DynamoDBStreamHandler } from 'aws-lambda';



export class AwsProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
   const queue = new aws_sns(this, 'AwsProjectQueue', {
    visibilityTimeout: cdk.Duration.seconds(300)
   });
  }

    const awsS3 = new aws_s3();
    const awsDynamodb = new aws_dynamodb();
    const awsSns = new aws_sns();
    const BUCKET_NAME = "hmtlcheck";
    const TABLE_NAME = "OneTable";

    const ALLOWED_EXTENSIONS = [".pdf",".jpg",".png","jpeg"];
    const CLIENT_EMAIL = process.env.CLIENT_EMAIL;

    const processFunction = new NodejsFunction(this,"ProcessFunction", {
    runtime: Runtime.NODEJS_20_X,
    handler: handler,
    entry: path.join(__dirname,"../source/function.ts")};


    export const handler: DynamoDBStreamHandler = async (event) => {
        for (const record of event.Records) {
            if (record.eventName !== 'INSERT') continue;

            const newItem = record.dynamodb?.NewImage;
            if (!newItem) continue;

            const fileSize = newItem.fileSize.N;
            const fileExtension = newItem.fileExtension.S;
            const uploadDate = newItem.uploadDate.S;

            const message = `
      File Metadata:
      - File Size: ${fileSize} bytes
      - File Extension: ${fileExtension}
      - Upload Date: ${uploadDate}
    `;

            const params = {
                Subject: 'New File Uploaded',
                Message: message,
                TopicArn: 'arn:aws:sns:region:account-id:FileUploadTopic',
            };

            await sns.publish(params).promise();
        }
    };
    
    const validTopic = new Topic(this, 'SuccessTopic', {
        topicName: 'SuccessTopic',
    });

    OneTable.grantReadWriteData(processFunction);
    SuccessTopic.grantPublish(processFunction);

    new PushSubscription(this, 'Subscription', {
    topic: SuccessTopic,
    protocol: SubscriptionProtocol.EMAIL,
    endpoint: 'hristo.zhelev@yahoo.com'
})
}
