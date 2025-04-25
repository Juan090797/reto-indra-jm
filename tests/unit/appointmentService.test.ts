import { AppointmentService } from '../../src/application/services/appointment.service';
import { DynamoDBAppointmentRepository } from '../../src/infrastructure/aws/dynamodb/appointment.repository';
import { SnsService } from '../../src/infrastructure/aws/sns/sns.service';
import { CreateAppointmentDto } from '../../src/application/dtos/createAppointment.dto';
import { CountriesEnum } from '../../src/domain/enums/countries.enum';

jest.mock('../../src/infrastructure/aws/dynamodb/appointment.repository');
jest.mock('../../src/infrastructure/aws/sns/sns.service');

describe('AppointmentService', () => {
    let appointmentService: AppointmentService;
    let mockRepository: jest.Mocked<DynamoDBAppointmentRepository>;
    let mockSnsService: jest.Mocked<SnsService>;

    beforeEach(() => {

        mockRepository = new DynamoDBAppointmentRepository() as jest.Mocked<DynamoDBAppointmentRepository>;
        mockSnsService = new SnsService() as jest.Mocked<SnsService>;

        mockRepository.createAppointment = jest.fn();
        mockSnsService.publishAppointmentCreated = jest.fn();

        appointmentService = new AppointmentService();
    });

    it('should create an appointment successfully', async () => {
        const createAppointmentDto: CreateAppointmentDto = new CreateAppointmentDto('insured123', 1, CountriesEnum.PE);
        const mockAppointment = { id: '123', ...createAppointmentDto, status: 'PENDING', createdAt: new Date(), updatedAt: new Date() };

        mockRepository.createAppointment.mockResolvedValue(mockAppointment);
        mockSnsService.publishAppointmentCreated.mockResolvedValue(undefined);

        const result = await appointmentService.createAppointment(createAppointmentDto);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).message).toBe('Appointment created successfully');
        expect(mockRepository.createAppointment).toHaveBeenCalledWith(expect.objectContaining({ insuredId: 'insured123' }));
        expect(mockSnsService.publishAppointmentCreated).toHaveBeenCalledWith(expect.objectContaining({ insuredId: 'insured123' }));
    });

    it('should throw error if appointment data is invalid', async () => {
        await expect(appointmentService.createAppointment(null as any)).rejects.toThrow('Invalid appointment data');
    });
});
