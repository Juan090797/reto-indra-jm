import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentMysqlPeRepository } from "../../domain/repositories/appointmentMysqlPe.repository";
import getConnectionMysqlPe from "../config/mysqldbPe.config";

export class MysqlAppointmentPeRepository implements AppointmentMysqlPeRepository {

    async createAppointment(appointment: Appointment): Promise<void> {

        const formatDateToMySQL = (date: Date): string =>
            date.toISOString().slice(0, 19).replace('T', ' ');

        const query = `INSERT INTO appointments (id, insuredId, scheduleId, countryISO, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            appointment.id,
            appointment.insuredId,
            appointment.scheduleId,
            appointment.countryISO,
            appointment.status,
            formatDateToMySQL(appointment.createdAt),
            formatDateToMySQL(appointment.updatedAt)
        ];

        let connection;

        try {
            connection = await getConnectionMysqlPe();
            const result = await connection.execute(query, values);
        } catch (error: any) {
            throw error;
        }finally {
            if (connection) {
                connection.end();
            }
        }
    }
}
