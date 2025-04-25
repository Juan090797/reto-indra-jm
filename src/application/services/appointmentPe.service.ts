import { Appointment } from "../../domain/entities/appointment.entity";
import { EventBridgeService } from "../../infrastructure/aws/eventbridge/eventbridge.service";
import { MysqlAppointmentPeRepository } from "../../infrastructure/mysql/appointmentPe.repository";

export class AppointmentPeService {
    private readonly appointmentPeRepository;
    private readonly eventBridgeService;
    
    constructor() {
        this.appointmentPeRepository = new MysqlAppointmentPeRepository();
        this.eventBridgeService = new EventBridgeService();
    }
    
    async createAppointment(appointment: Appointment): Promise<any> {
        console.log("Creating appointment in service appointmentPe.service.ts");
        if (!appointment) {
            throw new Error("Invalid appointment appointment");
        }
        try {
            await this.appointmentPeRepository.createAppointment(appointment);
            await this.eventBridgeService.publishAppointmentConfirmed(appointment.id);
        }
        catch (error) {
            console.error("Error creating appointment", error);
            throw new Error("Error creating appointment");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Appointment created successfully AppointmentPeService',
            }),
        }

        
    }
}