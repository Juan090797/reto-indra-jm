"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBAppointmentRepository = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamodb_config_1 = require("../../config/dynamodb.config");
const env_config_1 = require("../../config/env.config");
class DynamoDBAppointmentRepository {
    constructor() {
        this.envConfig = new env_config_1.EnvConfig();
        this.tableName = this.envConfig.get('DYNAMODB_APPOINTMENTS');
    }
    getAppointmentsByInsuredId(insuredId) {
        throw new Error("Method not implemented.");
    }
    async createAppointment(appointment) {
        const params = {
            TableName: this.tableName,
            Item: {
                ...appointment,
                createdAt: appointment.createdAt.toISOString(),
                updatedAt: appointment.updatedAt.toISOString(),
            }
        };
        await dynamodb_config_1.dynamoDb.send(new lib_dynamodb_1.PutCommand(params));
        console.log('Cita guardada en BD DynamoDB:', params.Item);
        return params.Item;
    }
}
exports.DynamoDBAppointmentRepository = DynamoDBAppointmentRepository;
