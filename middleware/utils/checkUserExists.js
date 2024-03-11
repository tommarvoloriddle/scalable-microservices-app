// utility function to check if a user exists in the database
const dotenv = require('dotenv').config()
const AWS = require('aws-sdk');
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
// Set up AWS credentials (assuming you have AWS credentials set up in your environment or through other means)
// Set up AWS credentials (assuming you have AWS credentials set up in your environment or through other means)
AWS.config.update({
    region: AWS_REGION, // Specify the AWS region you are working with
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });

const TableName = 'users';

const checkUserExists = async (user) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: TableName,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': user.username
        }
    };

    try {
        const data = await dynamodb.query(params).promise();
        if (data.Items.length > 0) {
            return data.Items[0];
        } else {
            console.log('User does not exist');
            return null;
        }
    } catch (error) {
        console.error('Unable to get item. Error JSON:', JSON.stringify(error, null, 2));
        return null;
    }
}

exports.checkUserExists = checkUserExists;