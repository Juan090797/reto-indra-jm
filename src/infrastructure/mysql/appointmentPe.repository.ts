import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentMysqlPeRepository } from "../../domain/repositories/appointmentMysqlPe.repository";
import poolPe from "../config/mysqldbPe.config";

export class MysqlAppointmentPeRepository implements AppointmentMysqlPeRepository {
    
    async createAppointment(appointment: Appointment): Promise<void> {
        console.log("Creating appointment in MySQL database", appointment);
        try {
            
            // await poolPe.getConnection().then((connection) => {
            //     console.log("Connected to MySQL database");
            //     connection.release();
            // }).catch((error) => {
            //     console.error("Error connecting to MySQL database", error);
            //     throw new Error("Error connecting to MySQL database");
            //     }
            // );


            const query = `INSERT INTO appointments (id, insuredId, scheduleId, countryISO, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [appointment.id, appointment.insuredId, appointment.scheduleId, appointment.countryISO, appointment.status, appointment.createdAt, appointment.updatedAt];
            await poolPe.query(query, values);
            console.log("Appointment created successfully in MySQL database.");
        }
        catch (error) {
            console.error("Error creating appointment in MySQL database", error);
            throw new Error("Error creating appointment in MySQL database");
        }
    }
}
