import { SQSEvent } from "aws-lambda";
import { HANDLER_EVENTS } from "../../shared/constants";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentClService } from "../../application/services/appointmentCl.service";

const appointmentClService = new AppointmentClService();

export const main = async (event: any) => {
    console.log("Handling event CHILE");
    console.log(event);

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
    
    console.log("Handling SQS event 0");
    console.log(event);

    for (const record of event.Records) {
        console.log("Processing SQS message 1");
        const message = JSON.parse(record.body);
        const appointmentData = JSON.parse(message.Message);
        console.log("Processing appointment data 2");
        const appointment = new Appointment({
            id: appointmentData.id,
            insuredId: appointmentData.insuredId,
            scheduleId: appointmentData.scheduleId,
            countryISO: appointmentData.countryISO,
            status: appointmentData.status,
            createdAt: new Date(appointmentData.createdAt),
            updatedAt: new Date(appointmentData.updatedAt),
        });
        console.log("Creating appointment");
        await appointmentClService.createAppointment(appointment);
        console.log("Appointment created successfully");
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from SQS!',
        }),
    };
}
 