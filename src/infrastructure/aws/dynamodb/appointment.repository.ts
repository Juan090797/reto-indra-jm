import { PutCommand, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { Appointment } from "../../../domain/entities/appointment.entity";
import { AppointmentDynamoRepository } from "../../../domain/repositories/appointmentDynamo.repository";
import { dynamoDb } from "../../config/dynamodb.config";
import { EnvConfig } from '../../config/env.config';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { StatusEnum } from "../../../domain/enums/status.enum";

export class DynamoDBAppointmentRepository implements AppointmentDynamoRepository {
    private readonly tableName: string;
    private readonly envConfig: EnvConfig;
    constructor() {
        this.envConfig = new EnvConfig();
        this.tableName = this.envConfig.get<string>('DYNAMODB_APPOINTMENTS');
    }

    async updateAppointment(appointmentId: string): Promise<any> {
        console.log("updateAppointment", appointmentId);
        if (!appointmentId) {
            throw new Error("Invalid appointmentId");
        }
        const params: UpdateCommandInput = {
            TableName: this.tableName,
            Key: {
                id: appointmentId,
            },
            UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
                ':status': StatusEnum.COMPLETED,
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        };

        const result = await dynamoDb.send(new UpdateCommand(params));
        console.log('Cita actualizada en BD DynamoDB:', result.Attributes);

        return result.Attributes;
    }

    async getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]> {

        if (!insuredId) {
            throw new Error("Invalid insuredId");
        }

        const params = {
            TableName: this.tableName,
            IndexName: 'insuredIdIndex',
            KeyConditionExpression: 'insuredId = :insuredId',
            ExpressionAttributeValues: {
                ':insuredId': insuredId,
            },
        };
    
        try {
            const result = await dynamoDb.send(new QueryCommand(params));            
            console.log(`Citas recuperadas para insuredId (${insuredId}):`, result.Items);

            return result.Items as Appointment[] || [];
    
        } catch (error) {
            console.error(`Error al obtener citas para insuredId (${insuredId}):`, error);
            throw error;
        }
        
    }

    async createAppointment(appointment: Appointment): Promise<any> {
        const params = {
            TableName: this.tableName,
            Item: {
                id: appointment.id,
                insuredId: appointment.insuredId,
                scheduleId: appointment.scheduleId,
                countryISO: appointment.countryISO,
                status: appointment.status,
                createdAt: appointment.createdAt.toISOString(),
                updatedAt: appointment.updatedAt.toISOString(),
            }
        };
        await dynamoDb.send(new PutCommand(params));
        console.log('Cita guardada en BD DynamoDB:', params.Item);
        return params.Item;
    }
    


}