import { Appointment } from "../../domain/entities/appointment.entity";
import { DynamoDBAppointmentRepository } from "../../infrastructure/aws/dynamodb/appointment.repository";
import { SnsService } from "../../infrastructure/aws/sns/sns.service";
import { CreateAppointmentDto } from "../dtos/createAppointment.dto";
import { AppointmentMapper } from "../mappers/appointment.mapper";

export class AppointmentService {
    private readonly appointmentRepository;
    private readonly snsService;
    constructor() {
        this.appointmentRepository = new DynamoDBAppointmentRepository();
        this.snsService = new SnsService();
    }
    
    async createAppointment(data: CreateAppointmentDto): Promise<any> {

        if (!data) {
            throw new Error("Invalid appointment data");
        }
        
        const appointment = AppointmentMapper.toDomain(data);

        const response = await this.appointmentRepository.createAppointment(appointment);
        await this.snsService.publishAppointmentCreated(appointment);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Appointment created successfully',
                appointment: response,
            }),
        }

    }

    async getAppointmentsByInsuredId(insuredId: string): Promise<any> {
        console.log("getAppointmentsByInsuredId", insuredId);
        if (!insuredId) {
            throw new Error("Invalid insuredId");
        }
        const response = await this.appointmentRepository.getAppointmentsByInsuredId(insuredId);
        console.log("response final", response);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Appointments retrieved successfully',
                appointments: response,
            }),
        }
    }
}