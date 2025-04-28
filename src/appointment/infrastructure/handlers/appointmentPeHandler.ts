import { SQSEvent } from "aws-lambda";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentPeService } from "../../application/services/appointmentPe.service";
import { HANDLER_EVENTS, HTTP_STATUS_CODE, HTTP_STATUS_CODE_MESSAGE } from "../../../common/utils/constants";
import { CustomException } from "../../../common/exceptions/custom.exception";
import { baseBodyToApiResponse } from "../../../common/mappers/apiResponse.mapper";
import { BaseBody } from "../../../common/dtos/baseBody";
import { Logger } from "../../../common/utils/logger";

const appointmentPeService = new AppointmentPeService();

export const main = async (event: any) => {
    Logger.info('Iniciando Main PE');
    try {
        let response;
        if (HANDLER_EVENTS.SQS in event) {
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

const handleSQSEvent = async (event: SQSEvent) => {
    Logger.info('Iniciando handleSQSEvent PE');
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
        await appointmentPeService.createAppointment(appointment);
    }

    return { appointments: event.Records.length };
}
