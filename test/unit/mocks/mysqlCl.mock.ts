export const mysqlClConnectionMock = {
    execute: jest.fn(),
    end: jest.fn()
};

export const getConnectionMysqlCl = jest.fn().mockResolvedValue(mysqlClConnectionMock);