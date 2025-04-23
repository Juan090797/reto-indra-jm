"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const constants_1 = require("../../shared/constants");
const appointment_service_1 = require("../../application/services/appointment.service");
const appointmentService = new appointment_service_1.AppointmentService();
const handler = async (event) => {
    if (constants_1.HANDLER_EVENTS.API_GATEWAY in event) {
        return handleAPIGatewayEvent(event);
    }
    else if (constants_1.HANDLER_EVENTS.SQS in event) {
        return handleSQSEvent(event);
    }
    else {
        console.error("Unknown event type", event);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Unknown event type',
            }),
        };
    }
};
exports.handler = handler;
const handleAPIGatewayEvent = async (event) => {
    console.log("Handling API Gateway event");
    console.log(event);
    console.log(event.httpMethod);
    if (event.httpMethod === constants_1.HTTP_METHODS.GET) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Hello from API Gateway  GET!',
            }),
        };
    }
    else if (event.httpMethod === constants_1.HTTP_METHODS.POST) {
        return await appointmentService.createAppointment(JSON.parse(event.body || '{}'));
    }
    else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Unsupported HTTP method',
            }),
        };
    }
};
const handleSQSEvent = async (event) => {
    console.log("Handling SQS event");
    console.log(event);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from SQS!',
        }),
    };
};
