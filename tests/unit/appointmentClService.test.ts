import { AppointmentClService } from '../../src/application/services/appointmentCl.service';
import { MysqlAppointmentClRepository } from '../../src/infrastructure/mysql/appointmentCl.repository';
import { EventBridgeService } from '../../src/infrastructure/aws/eventbridge/eventbridge.service';
import { Appointment } from '../../src/domain/entities/appointment.entity';
import { CountriesEnum } from '../../src/domain/enums/countries.enum';
import { StatusEnum } from '../../src/domain/enums/status.enum';

jest.mock('../../src/infrastructure/mysql/appointmentCl.repository');
jest.mock('../../src/infrastructure/aws/eventbridge/eventbridge.service');

describe('AppointmentClService', () => {
    let appointmentClService: AppointmentClService;
    let mockRepository: jest.Mocked<MysqlAppointmentClRepository>;
    let mockEventBridgeService: jest.Mocked<EventBridgeService>;

    beforeEach(() => {
        mockRepository = new MysqlAppointmentClRepository() as jest.Mocked<MysqlAppointmentClRepository>;
        mockEventBridgeService = new EventBridgeService() as jest.Mocked<EventBridgeService>;

        mockRepository.createAppointment = jest.fn();
        mockEventBridgeService.publishAppointmentConfirmed = jest.fn();

        appointmentClService = new AppointmentClService();
    });

    it('should create appointment and publish to event bridge', async () => {
        const appointment: Appointment = new Appointment({
            id: '123',
            insuredId: 'insured123',
            scheduleId: 1,
            countryISO: CountriesEnum.CL,
            status: StatusEnum.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        mockRepository.createAppointment.mockResolvedValue(undefined);
        mockEventBridgeService.publishAppointmentConfirmed.mockResolvedValue(undefined);

        const result = await appointmentClService.createAppointment(appointment);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).message).toBe('Appointment created successfully');
        expect(mockRepository.createAppointment).toHaveBeenCalledWith(appointment);
        expect(mockEventBridgeService.publishAppointmentConfirmed).toHaveBeenCalledWith('123');
    });
});
