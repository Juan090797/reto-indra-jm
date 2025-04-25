import { AppointmentPeService } from '../../src/application/services/appointmentPe.service';
import { MysqlAppointmentPeRepository } from '../../src/infrastructure/mysql/appointmentPe.repository';
import { EventBridgeService } from '../../src/infrastructure/aws/eventbridge/eventbridge.service';
import { Appointment } from '../../src/domain/entities/appointment.entity';
import { CountriesEnum } from '../../src/domain/enums/countries.enum';
import { StatusEnum } from '../../src/domain/enums/status.enum';

jest.mock('../../src/infrastructure/mysql/appointmentPe.repository');
jest.mock('../../src/infrastructure/aws/eventbridge/eventbridge.service');

describe('AppointmentPeService', () => {
    let appointmentPeService: AppointmentPeService;
    let mockRepository: jest.Mocked<MysqlAppointmentPeRepository>;
    let mockEventBridgeService: jest.Mocked<EventBridgeService>;

    beforeEach(() => {
        
        mockRepository = new MysqlAppointmentPeRepository() as jest.Mocked<MysqlAppointmentPeRepository>;
        mockEventBridgeService = new EventBridgeService() as jest.Mocked<EventBridgeService>;
        
        mockRepository.createAppointment = jest.fn();
        mockEventBridgeService.publishAppointmentConfirmed = jest.fn();
        
        appointmentPeService = new AppointmentPeService();
    });

    it('should create appointment and publish to event bridge', async () => {
        const appointment: Appointment = new Appointment({
            id: '123adacaacacwwfwfwfwf',
            insuredId: '00006',
            scheduleId: 1,
            countryISO: CountriesEnum.PE,
            status: StatusEnum.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        
        mockRepository.createAppointment.mockResolvedValue(undefined);
        mockEventBridgeService.publishAppointmentConfirmed.mockResolvedValue(undefined);
        
        const result = await appointmentPeService.createAppointment(appointment);
        
        expect(result.statusCode).toBe(200);
        expect(mockRepository.createAppointment).toHaveBeenCalledWith(appointment);
        expect(mockEventBridgeService.publishAppointmentConfirmed).toHaveBeenCalledWith('00006');
    });
});
