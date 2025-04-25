import { v4 } from "uuid";
import { Appointment } from "../../domain/entities/appointment.entity";
import { CreateAppointmentDto } from "../dtos/createAppointment.dto";
import { StatusEnum } from "../../domain/enums/status.enum";

export class AppointmentMapper {
    static toDomain(appointment: CreateAppointmentDto): Appointment {
        return new Appointment(
            {
                id: v4(),
                insuredId: appointment.insuredId,
                scheduleId: appointment.scheduleId,
                countryISO: appointment.countryISO,
                status: StatusEnum.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        );
    }
}