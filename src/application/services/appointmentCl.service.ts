import { Appointment } from "../../domain/entities/appointment.entity";
import { EventBridgeService } from "../../infrastructure/aws/eventbridge/eventbridge.service";
import { MysqlAppointmentClRepository } from "../../infrastructure/mysql/appointmentCl.repository";


export class AppointmentClService {
    private readonly appointmentClRepository;
    private readonly eventBridgeService;

    constructor() {
        this.appointmentClRepository = new MysqlAppointmentClRepository();
        this.eventBridgeService = new EventBridgeService();
    }
    
    async createAppointment(appointment: Appointment): Promise<any> {

        if (!appointment) {
            throw new Error("Invalid appointment appointment");
        }
        try {
            await this.appointmentClRepository.createAppointment(appointment);
            await this.eventBridgeService.publishAppointmentConfirmed(appointment.id);
        }
        catch (error) {
            throw new Error("Error creating appointment");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Appointment created successfully',
            }),
        }

        
    }
}