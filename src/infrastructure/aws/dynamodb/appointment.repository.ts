import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Appointment } from "../../../domain/entities/appointment.entity";
import { AppointmentDynamoRepository } from "../../../domain/repositories/appointmentDynamo.repository";
import { dynamoDb } from "../../config/dynamodb.config";
import { EnvConfig } from '../../config/env.config';

export class DynamoDBAppointmentRepository implements AppointmentDynamoRepository {
    private readonly tableName: string;
    private readonly envConfig: EnvConfig;
    constructor() {
        this.envConfig = new EnvConfig();
        this.tableName = this.envConfig.get<string>('DYNAMODB_APPOINTMENTS');
    }

    getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]> {
        throw new Error("Method not implemented.");

    }

    async createAppointment(appointment: Appointment): Promise<any> {
        const params = {
            TableName: this.tableName,
            Item: {
                ...appointment,
                createdAt: appointment.createdAt.toISOString(),
                updatedAt: appointment.updatedAt.toISOString(),
            }
        };
        await dynamoDb.send(new PutCommand(params));
        console.log('Cita guardada en BD DynamoDB:', params.Item);
        return params.Item;
    }


}