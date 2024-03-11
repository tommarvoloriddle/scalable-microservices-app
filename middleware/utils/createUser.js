// utiltiy function to create a user
require('dotenv').config()
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const usersTable = 'users';
const userExists = require('./checkUserExists');
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Set up AWS credentials (assuming you have AWS credentials set up in your environment or through other means)
AWS.config.update({
    region: AWS_REGION, // Specify the AWS region you are working with
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });

// create new UUID for user

const newUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const getCreatedTimeStamp = () => {
    return new Date().toISOString();
}

// hash password using bcrypt

const hashPassword =  (password) => {
    console.log('password:', password);
    return password;
    // return await bcrypt.hash(password, 10);
}

const createNewUser = async (username, password) => {
    const newUser = {
        userId : newUUID(),
        username: username,
        password: password,
        timecreated : getCreatedTimeStamp()
    };
    return await saveUser(newUser);  
}

//  save user to Amazon DynamoDB

const saveUser = async (user) => {
    // save user to DynamoDB
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    // check if user exists in the database

    const params = {
        TableName: usersTable, // Replace with your actual table name
        Item: user
    };

    try {
        const bUserExists = await userExists.checkUserExists(user); // Assuming userExists is properly defined
        if (!bUserExists) {
            await dynamodb.put(params).promise();
            console.log('Added User:', user.username);
            return user;
        } else {
            console.log('User already exists');
            if (bUserExists.password === user.password) {
                return bUserExists;
            } else {
                return null;
            }
        }
    } catch (error) {
        console.error('Unable to add user:', error);
        return null;
    }
}

exports.createNewUser = createNewUser;