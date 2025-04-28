jest.mock('../../../../../src/appointment/infrastructure/config/mysqldbCl.config', () => ({
    __esModule: true,
    default: jest.fn()
}));

import getConnectionMysqlCl from '../../../../../src/appointment/infrastructure/config/mysqldbCl.config';
import { MysqlAppointmentClRepository } from '../../../../../src/appointment/infrastructure/mysql/appointmentCl.repository';
import { mysqlClConnectionMock } from '../../../mocks/mysqlCl.mock';
import { mockAppointmentEntity } from '../../../steps/appointmentSteps';



describe('MysqlAppointmentClRepository', () => {
    let repository: MysqlAppointmentClRepository;

    beforeEach(() => {
        (getConnectionMysqlCl as jest.Mock).mockResolvedValue(mysqlClConnectionMock);
        repository = new MysqlAppointmentClRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createAppointment', () => {
        it('debería insertar exitosamente', async () => {
            mysqlClConnectionMock.execute.mockResolvedValueOnce({});
            await repository.createAppointment(mockAppointmentEntity());
            expect(mysqlClConnectionMock.execute).toHaveBeenCalled();
        });

        it('debería lanzar error si falla ejecución', async () => {
            mysqlClConnectionMock.execute.mockRejectedValue(new Error('Mysql error'));
            await expect(repository.createAppointment(mockAppointmentEntity()))
                .rejects.toThrow('Error insertar appointment');
        });
    });
});