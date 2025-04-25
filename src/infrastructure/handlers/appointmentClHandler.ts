import { SQSEvent } from "aws-lambda";
import { HANDLER_EVENTS } from "../../shared/constants";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentClService } from "../../application/services/appointmentCl.service";

const appointmentClService = new AppointmentClService();

export const main = async (event: any) => {

    if(HANDLER_EVENTS.SQS in event) {
        await handleSQSEvent(event as SQSEvent);
    }else{
        console.error("Unknown event type", event);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Unknown event type',
            }),
        };
    }
}

const handleSQSEvent = async (event: SQSEvent) => {
    
    for (const record of event.Records) {

        const message = JSON.parse(record.body);
        const appointmentData = JSON.parse(message.Message);
        const appointment = new Appointment({
            id: appointmentData.id,
            insuredId: appointmentData.insuredId,
            scheduleId: appointmentData.scheduleId,
            countryISO: appointmentData.countryISO,
            status: appointmentData.status,
            createdAt: new Date(appointmentData.createdAt),
            updatedAt: new Date(appointmentData.updatedAt),
        });

        await appointmentClService.createAppointment(appointment);
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from SQS!',
        }),
    };
}
 