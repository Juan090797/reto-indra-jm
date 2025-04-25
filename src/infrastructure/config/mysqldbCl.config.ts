import mysql from 'mysql2/promise';

const configDBCl = {
    host: process.env.DB_HOST_CL,
    user: process.env.DB_USERNAME_CL,
    password: process.env.DB_PASSWORD_CL,
    database: process.env.DB_NAME_CL,
    port: Number(process.env.DB_PORT_CL),

};


const getConnectionMysqlCl = async () => {
    try {
        const connection = await mysql.createConnection(configDBCl);
        return connection;
    } catch (error: any) {
        throw error;
    }
}

export default getConnectionMysqlCl;