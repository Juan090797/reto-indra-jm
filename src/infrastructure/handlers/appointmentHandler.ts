import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { HANDLER_EVENTS, HTTP_METHODS } from "../../shared/constants";
import { AppointmentService } from "../../application/services/appointment.service";

const appointmentService = new AppointmentService();

export const handler = async (event: APIGatewayEvent | SQSEvent) => {

    if ( HANDLER_EVENTS.API_GATEWAY in event ) {     
        return handleAPIGatewayEvent(event as APIGatewayEvent);
    } else if ( HANDLER_EVENTS.SQS in event ) {
        return handleSQSEvent(event as SQSEvent);
    } else {
        console.error("Unknown event type", event);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Unknown event type',
            }),
        };
    }
    
}

const handleAPIGatewayEvent = async (event: APIGatewayEvent) => {
    
    console.log("Handling API Gateway event");
    console.log(event);
    console.log(event.httpMethod);
    if (event.httpMethod === HTTP_METHODS.GET) {
        return await appointmentService.getAppointmentsByInsuredId(event.pathParameters?.insuredId || '');
    }else if (event.httpMethod === HTTP_METHODS.POST) {
        return await appointmentService.createAppointment(JSON.parse(event.body || '{}'));
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Unsupported HTTP method',
            }),
        };
    }
}

const handleSQSEvent = async (event: SQSEvent) => {
    
    console.log("Handling SQS event ACTUALIZANDO CITA MEDICA");
    console.log(event);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from SQS!',
        }),
    };
}
 