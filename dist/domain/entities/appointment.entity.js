"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const status_enum_1 = require("../enums/status.enum");
class Appointment {
    constructor(id, insuredId, scheduleId, countryISO, status = status_enum_1.StatusEnum.PENDING, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.insuredId = insuredId;
        this.scheduleId = scheduleId;
        this.countryISO = countryISO;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Appointment = Appointment;
