import * as events from "node:events";
import { SNSClient } from "@aws-sdk/client-sns";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Any = jasmine.Any;
import {ALL} from "node:dns";



const getFileExtension = (fileName: string) => {
    fileName.substring(fileName.lastIndexOf("."));
}

export const handler = async (event: Any) => {
    try {
        const file = event;
        const fileName = event.headers["File-Name"];
        const fileSize = ALL
        const extenstions = getFileExtension(fileName);
    }

    const uploadParams = {
        Bucket: 'hmtlcheck',
        Key: `${Date.now()}-${__filename}`,
        Body: file,
    };
    await s3.upload(file, uploadParams);
};
