import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as aws-project from '../lib/aws-project-stack';
import app from '../source/app';
import {request} from "node:http";

describe('File Upload API', () => {
    it('should upload a file and store metadata in DynamoDB', async () => {
        const filePath = '__tests__/testFile.jpg'; // Path to a test file

        const response = await request(app)
            .post('/api/upload')
            .attach('file', filePath);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('fileSize');
        expect(response.body).toHaveProperty('fileExtension');
    });
});
