import { CreateAppointmentDto } from '../../../src/appointment/application/dtos/createAppointment.dto';
import { CountriesEnum } from '../../../src/appointment/domain/enums/countries.enum';
import { StatusEnum } from '../../../src/appointment/domain/enums/status.enum';

export const validAppointmentDto = (): CreateAppointmentDto => ({
    insuredId: '12345',
    scheduleId: 1,
    countryISO: CountriesEnum.PE
});

export const invalidAppointmentDto = (): any => ({
    insuredId: 'abc',
    scheduleId: 'wrong',
    countryISO: CountriesEnum.PE
});

export const mockAppointmentEntity = () => ({
    id: 'uuid',
    insuredId: '12345',
    scheduleId: 1,
    countryISO: CountriesEnum.PE,
    status: StatusEnum.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
});