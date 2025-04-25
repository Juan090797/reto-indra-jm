import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentMysqlClRepository } from "../../domain/repositories/appointmentMysqlCl.repository";

import getConnectionMysqlCl from "../config/mysqldbCl.config";

export class MysqlAppointmentClRepository implements AppointmentMysqlClRepository {

    async createAppointment(appointment: Appointment): Promise<void> {
        console.log("📥 Punto para insertar los datos:");

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

        console.log("🛠 Query MySQL:", query);
        console.log("📦 Valores:", values);

        let connection;

        try {
            console.log("🔗 Conectando a la base de datos MySQL...");
            connection = await getConnectionMysqlCl();
            const result = await connection.execute(query, values);
            console.log("✅ Resultado insert:", result);
        } catch (error: any) {
            console.error("⛔ Error MySQL:", error.message, error.code, error.sqlMessage);
            throw error;
        }finally {
            if (connection) {
                connection.end(); // Asegúrate de cerrar la conexión después de usarla.
            }
        }
    }
}
