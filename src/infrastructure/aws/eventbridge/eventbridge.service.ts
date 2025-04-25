import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { AppointmentEventService } from "../../../domain/services/appointmentEvent.service";
import { EnvConfig } from "../../config/env.config";
import { eventBridgeClient } from "../../config/eventbridge.config";

export class EventBridgeService implements AppointmentEventService {
    private readonly envConfig: EnvConfig;
    private readonly eventBusName: string;
    private readonly eventSource: string;
    private readonly eventType: string;
    constructor() {
        this.envConfig = new EnvConfig();
        this.eventBusName = this.envConfig.get<string>('EVENT_BUS_NAME');
        this.eventSource = this.envConfig.get<string>('EVENT_SOURCE');
        this.eventType = this.envConfig.get<string>('EVENT_DETAIL_TYPE');
    }

    async publishAppointmentConfirmed(appointmentId: string): Promise<void> {

        const params = {
            Entries: [
                {
                    Source: this.eventSource,
                    DetailType: this.eventType,
                    Detail: JSON.stringify({
                        appointmentId,
                        status: "completed"
                    }),
                    EventBusName: this.eventBusName,
                }
            ]
        };

        try {
            const result = await eventBridgeClient.send(new PutEventsCommand(params));
            if (result.FailedEntryCount && result.FailedEntryCount > 0) {
                console.error('Error al publicar eventos:', JSON.stringify(result.Entries));
            }
        } catch (error) {
            console.error('Error al publicar en EventBridge:', error);
            throw error;
        }
    }
}