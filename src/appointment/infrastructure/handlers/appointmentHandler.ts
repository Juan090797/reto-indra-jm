import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { AppointmentService } from "../../application/services/appointment.service";
import { HANDLER_EVENTS, HTTP_METHODS, HTTP_STATUS_CODE_MESSAGE, HTTP_STATUS_CODE } from "../../../common/utils/constants";
import { CustomException } from "../../../common/exceptions/custom.exception";
import { BaseBody } from "../../../common/dtos/baseBody";
import { baseBodyToApiResponse } from "../../../common/mappers/apiResponse.mapper";
import { Logger } from "../../../common/utils/logger";

const appointmentService = new AppointmentService();

export const handler = async (event: any) => {
    Logger.info('Iniciando handler');
    try {
        let response;
        if (HANDLER_EVENTS.API_GATEWAY in event ) {     
            response = await handleAPIGatewayEvent(event as APIGatewayEvent);
        } else if ( HANDLER_EVENTS.SQS in event ) {
            response = await handleSQSEvent(event as SQSEvent);
        } else {
            Logger.error("Tipo de evento desconocido", event);
            throw new CustomException("Tipo de evento desconocido", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return baseBodyToApiResponse(BaseBody.success(response, HTTP_STATUS_CODE_MESSAGE.OK), HTTP_STATUS_CODE.OK);
    } catch (error: any) {
        if (error instanceof CustomException) {
            return baseBodyToApiResponse(BaseBody.error(error.message, error.errors), error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
        return baseBodyToApiResponse(BaseBody.error(error.message), HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);      
    }
}

const handleAPIGatewayEvent = async (event: APIGatewayEvent) => {
    let response;
    if (event.httpMethod === HTTP_METHODS.GET) {
        response = await appointmentService.getAppointmentsByInsuredId(event.pathParameters?.insuredId || '');
    }else if (event.httpMethod === HTTP_METHODS.POST) {
        response = await appointmentService.createAppointment(JSON.parse(event.body || '{}'));
    } else {
        throw new CustomException(HTTP_STATUS_CODE_MESSAGE[HTTP_STATUS_CODE.METHOD_NOT_ALLOWED], HTTP_STATUS_CODE.METHOD_NOT_ALLOWED);
    }
    return response;
}

const handleSQSEvent = async (event: SQSEvent) => {
    const data:any = JSON.parse(event.Records[0].body);
    await appointmentService.updateAppointment(data?.detail?.appointmentId);
    return data;
}
 