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
        console.log("Conexión exitosa a la base de datos MySQL.");
        return connection;
    } catch (error: any) {
        console.error("Error al conectar a la base de datos MySQL:", error.message);
        throw error;
    }
}

export default getConnectionMysqlCl;