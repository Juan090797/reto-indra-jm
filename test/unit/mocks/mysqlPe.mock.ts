export const mysqlPeConnectionMock = {
    execute: jest.fn(),
    end: jest.fn()
};

export const getConnectionMysqlPe = jest.fn().mockResolvedValue(mysqlPeConnectionMock);