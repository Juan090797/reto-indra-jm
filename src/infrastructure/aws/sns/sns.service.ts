import { PublishCommand } from "@aws-sdk/client-sns";
import { Appointment } from "../../../domain/entities/appointment.entity";
import { EnvConfig } from "../../config/env.config";
import { snsClient } from "../../config/sns.config";
import { AppointmentSnsService } from "../../../domain/services/appointmentSns.service";

export class SnsService implements AppointmentSnsService {
    private readonly topicArn: string;
    private readonly envConfig: EnvConfig;

    constructor() {
        this.envConfig = new EnvConfig();
        this.topicArn = this.envConfig.get<string>('SNS_APPOINTMENT_CREATED_TOPIC_ARN');
    }

    async publishAppointmentCreated(appointment: Appointment): Promise<void> {
        console.log("Publishing appointment created event to SNS:", appointment);
        const params = {
            Message: JSON.stringify(appointment),
            TopicArn: this.topicArn,
            MessageAttributes: {
                countryISO: {
                    DataType: 'String',
                    StringValue: appointment.countryISO,
                }
            }     
        };
        console.log("Publishing message to SNS topic:", this.topicArn, params);
        await snsClient.send(new PublishCommand(params));
        console.log("Message published to SNS topic enviado:", this.topicArn);
    }
}