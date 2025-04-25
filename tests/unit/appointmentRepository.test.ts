import { DynamoDBAppointmentRepository } from '../../src/infrastructure/aws/dynamodb/appointment.repository';
import { Appointment } from '../../src/domain/entities/appointment.entity';
import { StatusEnum } from '../../src/domain/enums/status.enum';
import { CountriesEnum } from '../../src/domain/enums/countries.enum';

jest.mock('../../src/infrastructure/aws/dynamodb/appointment.repository');

describe('DynamoDBAppointmentRepository', () => {
    let repository: DynamoDBAppointmentRepository;
    let mockAppointment: Appointment;

    beforeEach(() => {
        repository = new DynamoDBAppointmentRepository();
        
        mockAppointment = new Appointment({
            id: '123',
            insuredId: '00006',
            scheduleId: 1,
            countryISO: CountriesEnum.PE,
            status: StatusEnum.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });

    it('should create an appointment', async () => {

        repository.createAppointment = jest.fn().mockResolvedValue(mockAppointment);

        const result = await repository.createAppointment(mockAppointment);

        expect(result).toEqual(mockAppointment);
        expect(repository.createAppointment).toHaveBeenCalledWith(mockAppointment);
    });

    it('should update an appointment', async () => {
        const updatedAppointment = { ...mockAppointment, status: StatusEnum.COMPLETED };

        repository.updateAppointment = jest.fn().mockResolvedValue(updatedAppointment);

        const result = await repository.updateAppointment(mockAppointment.id);

        expect(result.status).toBe(StatusEnum.COMPLETED);
        expect(repository.updateAppointment).toHaveBeenCalledWith(mockAppointment.id);
    });
});
