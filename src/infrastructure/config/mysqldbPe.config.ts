import mysql from 'mysql2/promise';

const configDBPe = {
    host: process.env.DB_HOST_PE,
    user: process.env.DB_USERNAME_PE,
    password: process.env.DB_PASSWORD_PE,
    database: process.env.DB_NAME_PE,
    port: Number(process.env.DB_PORT_PE),
};

const getConnectionMysqlPe = async () => {
    try {      
        const connection = await mysql.createConnection(configDBPe);
        return connection;
    } catch (error: any) {
        throw error;
    }
}

export default getConnectionMysqlPe;