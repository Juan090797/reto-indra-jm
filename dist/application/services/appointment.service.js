"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const appointment_entity_1 = require("../../domain/entities/appointment.entity");
const appointment_repository_1 = require("../../infrastructure/aws/dynamodb/appointment.repository");
const uuid_1 = require("uuid");
class AppointmentService {
    constructor() {
        this.appointmentRepository = new appointment_repository_1.DynamoDBAppointmentRepository();
    }
    async createAppointment(data) {
        if (!data) {
            throw new Error("Invalid appointment data");
        }
        const appointment = new appointment_entity_1.Appointment((0, uuid_1.v4)(), data.insuredId, data.scheduleId, data.countryISO);
        const response = await this.appointmentRepository.createAppointment(appointment);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Appointment created successfully',
                appointment: response,
            }),
        };
    }
    getAppointmentsByInsuredId(insuredId) {
        throw new Error("Method not implemented.");
    }
}
exports.AppointmentService = AppointmentService;
