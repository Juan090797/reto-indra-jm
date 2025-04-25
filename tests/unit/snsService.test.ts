import { SnsService } from '../../src/infrastructure/aws/sns/sns.service';
import { Appointment } from '../../src/domain/entities/appointment.entity';
import { CountriesEnum } from '../../src/domain/enums/countries.enum';
import { StatusEnum } from '../../src/domain/enums/status.enum';

jest.mock('@aws-sdk/client-sns');

describe('SnsService', () => {
    let snsService: SnsService;

    beforeEach(() => {
        snsService = new SnsService();
    });

    it('should publish appointment created event', async () => {
        const mockAppointment = new Appointment({
            id: '123',
            insuredId: 'insured123',
            scheduleId: 1,
            countryISO: CountriesEnum.PE,
            status: StatusEnum.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        snsService.publishAppointmentCreated = jest.fn().mockResolvedValue(undefined);

        await snsService.publishAppointmentCreated(mockAppointment);

        expect(snsService.publishAppointmentCreated).toHaveBeenCalledWith(mockAppointment);
    });

    it('should handle SNS publish failure', async () => {
        const mockAppointment = new Appointment({
            id: '123',
            insuredId: 'insured123',
            scheduleId: 1,
            countryISO: CountriesEnum.PE,
            status: StatusEnum.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        snsService.publishAppointmentCreated = jest.fn().mockRejectedValue(new Error('SNS Publish Failed'));

        await expect(snsService.publishAppointmentCreated(mockAppointment)).rejects.toThrow('SNS Publish Failed');
    });
});
