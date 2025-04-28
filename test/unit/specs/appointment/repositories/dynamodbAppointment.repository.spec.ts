jest.mock('../../../../../src/appointment/infrastructure/config/dynamodb.config', () => ({
    dynamoDb: {
        send: jest.fn()
    }
}));

import { DynamoDBAppointmentRepository } from '../../../../../src/appointment/infrastructure/aws/dynamodb/appointment.repository';
import { mockAppointmentEntity } from '../../../steps/appointmentSteps';
import { dynamoDb } from '../../../../../src/appointment/infrastructure/config/dynamodb.config';

describe('DynamoDBAppointmentRepository', () => {
    let repository: DynamoDBAppointmentRepository;

    beforeEach(() => {
        repository = new DynamoDBAppointmentRepository();
        jest.clearAllMocks();
    });

    describe('createAppointment', () => {
        it('debería crear cita exitosamente', async () => {
            (dynamoDb.send as jest.Mock).mockResolvedValue({});
            await repository.createAppointment(mockAppointmentEntity());
            expect(dynamoDb.send).toHaveBeenCalled();
        });

        it('debería lanzar error si falla DynamoDB', async () => {
            (dynamoDb.send as jest.Mock).mockRejectedValue(new Error('Dynamo error'));
            await expect(repository.createAppointment(mockAppointmentEntity()))
                .rejects.toThrow('Error creando el appointment');
        });
    });

    describe('updateAppointment', () => {
        it('debería actualizar cita exitosamente', async () => {
            (dynamoDb.send as jest.Mock).mockResolvedValue({ Attributes: {} });
            const response = await repository.updateAppointment('appointmentId');
            expect(response).toBeDefined();
        });

        it('debería lanzar error si falla actualización', async () => {
            (dynamoDb.send as jest.Mock).mockRejectedValue(new Error('Update error'));
            await expect(repository.updateAppointment('appointmentId'))
                .rejects.toThrow('Error al actualizar el appointment');
        });
    });

    describe('getAppointmentsByInsuredId', () => {
        it('debería retornar citas', async () => {
            (dynamoDb.send as jest.Mock).mockResolvedValue({ Items: [mockAppointmentEntity()] });
            const result = await repository.getAppointmentsByInsuredId('12345');
            expect(result.length).toBe(1);
        });

        it('debería lanzar error si falla búsqueda', async () => {
            (dynamoDb.send as jest.Mock).mockRejectedValue(new Error('Query error'));
            await expect(repository.getAppointmentsByInsuredId('12345'))
                .rejects.toThrow('Error al obtener citas para insuredId');
        });
    });
});
