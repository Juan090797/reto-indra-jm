import { Appointment } from "../../domain/entities/appointment.entity";
import { DynamoDBAppointmentRepository } from "../../infrastructure/aws/dynamodb/appointment.repository";
import { v4 } from 'uuid';

export class AppointmentService {
    private readonly appointmentRepository;
    constructor() {
        this.appointmentRepository = new DynamoDBAppointmentRepository();
    }
    
    async createAppointment(data: Appointment): Promise<any> {

        if (!data) {
            throw new Error("Invalid appointment data");
        }
        const appointment = new Appointment(
            v4(),
            data.insuredId,
            data.scheduleId,
            data.countryISO,
        );

        const response = await this.appointmentRepository.createAppointment(appointment);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Appointment created successfully',
                appointment: response,
            }),
        }

    }

    getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]> {
        throw new Error("Method not implemented."); 
    }
}