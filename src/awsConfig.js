// src/awsConfig.js
import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

// alert(process.env.REACT_APP_AWS_REGION)
export const dynamoDB = new AWS.DynamoDB.DocumentClient();
