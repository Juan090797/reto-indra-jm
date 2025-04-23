"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoDb = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const REGION = process.env.AWS_REGION || 'us-east-1';
const dynamoClient = new client_dynamodb_1.DynamoDBClient({ region: REGION });
const dynamoDb = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoClient);
exports.dynamoDb = dynamoDb;
