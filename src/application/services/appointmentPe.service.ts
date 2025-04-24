import { Appointment } from "../../domain/entities/appointment.entity";
import { MysqlAppointmentPeRepository } from "../../infrastructure/mysql/appointmentPe.repository";

export class AppointmentPeService {
    private readonly appointmentPeRepository;
    constructor() {
        this.appointmentPeRepository = new MysqlAppointmentPeRepository();
    }
    
    async createAppointment(data: Appointment): Promise<any> {
        console.log("Creating appointment in service", data);
        if (!data) {
            throw new Error("Invalid appointment data");
        }
        try {
            await this.appointmentPeRepository.createAppointment(data);
        }
        catch (error) {
            console.error("Error creating appointment", error);
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