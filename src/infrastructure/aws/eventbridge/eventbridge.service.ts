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
        console.log("Publishing appointment confirmed event to EventBridge");

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
        console.log("EventBridge params:", JSON.stringify(params));

        try {
            const result = await eventBridgeClient.send(new PutEventsCommand(params));
            console.log("EventBridge result:", JSON.stringify(result));
            if (result.FailedEntryCount && result.FailedEntryCount > 0) {
                console.error('Error al publicar eventos:', JSON.stringify(result.Entries));
            }
        } catch (error) {
            console.error('Error al publicar en EventBridge:', error);
            throw error;
        }finally {
            console.log("EventBridge publishAppointmentConfirmed finished");
        }
    }
}