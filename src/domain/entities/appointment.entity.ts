import { CountriesEnum } from "../enums/countries.enum";
import { StatusEnum } from "../enums/status.enum";
import { Schedule } from "./schedule.entity";

export class Appointment {
    constructor(
        public id: string,
        public insuredId: string,
        public scheduleId: Schedule,
        public countryISO: CountriesEnum,
        public status: StatusEnum = StatusEnum.PENDING,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) {}
}