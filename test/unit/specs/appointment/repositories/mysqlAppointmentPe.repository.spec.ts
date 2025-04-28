jest.mock('../../../../../src/appointment/infrastructure/config/mysqldbPe.config', () => ({
    __esModule: true,
    default: jest.fn()
}));

import getConnectionMysqlPe from '../../../../../src/appointment/infrastructure/config/mysqldbPe.config';
import { MysqlAppointmentPeRepository } from '../../../../../src/appointment/infrastructure/mysql/appointmentPe.repository';
import { mysqlPeConnectionMock } from '../../../mocks/mysqlPe.mock';
import { mockAppointmentEntity } from '../../../steps/appointmentSteps';



describe('MysqlAppointmentPeRepository', () => {
    let repository: MysqlAppointmentPeRepository;

    beforeEach(() => {
        (getConnectionMysqlPe as jest.Mock).mockResolvedValue(mysqlPeConnectionMock);
        repository = new MysqlAppointmentPeRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createAppointment', () => {
        it('debería insertar exitosamente', async () => {
            mysqlPeConnectionMock.execute.mockResolvedValueOnce({});
            await repository.createAppointment(mockAppointmentEntity());
            expect(mysqlPeConnectionMock.execute).toHaveBeenCalled();
        });

        it('debería lanzar error si falla ejecución', async () => {
            mysqlPeConnectionMock.execute.mockRejectedValue(new Error('Mysql error'));
            await expect(repository.createAppointment(mockAppointmentEntity()))
                .rejects.toThrow('Error insertar appointment');
        });
    });
});