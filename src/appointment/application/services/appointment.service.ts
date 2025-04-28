import { CustomException } from "../../../common/exceptions/custom.exception";
import { zodToCustomException } from "../../../common/mappers/customException.mapper";
import { HTTP_STATUS_CODE } from "../../../common/utils/constants";
import { Logger } from "../../../common/utils/logger";
import { DynamoDBAppointmentRepository } from "../../infrastructure/aws/dynamodb/appointment.repository";
import { SnsService } from "../../infrastructure/aws/sns/sns.service";
import { CreateAppointmentDto } from "../dtos/createAppointment.dto";
import { GetAppointmentResponseDto } from "../dtos/getAppointment.dto";
import { AppointmentMapper } from "../mappers/appointment.mapper";
import { CreateAppointmentSchema } from "../validations/createAppointmentSchema";

export class AppointmentService {
    private readonly appointmentRepository;
    private readonly snsService;
    constructor() {
        this.appointmentRepository = new DynamoDBAppointmentRepository();
        this.snsService = new SnsService();
    }

    async createAppointment(data: CreateAppointmentDto): Promise<GetAppointmentResponseDto> {
        Logger.info('Inicio del createAppointment');
        const result = CreateAppointmentSchema.safeParse(data);

        if (!result.success) {
            throw new CustomException("Datos inválidos", HTTP_STATUS_CODE.BAD_REQUEST, zodToCustomException(result.error));
        }

        const appointment = AppointmentMapper.toDomain(data);
        const response = await this.appointmentRepository.createAppointment(appointment);
        await this.snsService.publishAppointmentCreated(appointment);
        return AppointmentMapper.entityToDto(response);
    }

    async updateAppointment(appointmentId: string): Promise<any> {
        Logger.info('Inicio del updateAppointment');
        if (!appointmentId) {
            throw new CustomException("Es necesario appointmentId", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return await this.appointmentRepository.updateAppointment(appointmentId);
    }

    async getAppointmentsByInsuredId(insuredId: string): Promise<any> {
        Logger.info('Inicio del getAppointmentsByInsuredId');
        if (!insuredId) {
            throw new CustomException("Es necesario insuredId", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return await this.appointmentRepository.getAppointmentsByInsuredId(insuredId);
    }
}