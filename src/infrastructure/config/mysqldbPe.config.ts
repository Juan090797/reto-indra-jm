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
        console.log( 'host: ' + process.env.DB_HOST_PE );
        console.log( 'user: ' + process.env.DB_USERNAME_PE );
        console.log( 'password: ' + process.env.DB_PASSWORD_PE );
        console.log( 'database: ' + process.env.DB_NAME_PE );
        console.log( 'port: ' + process.env.DB_PORT_PE );
        
        const connection = await mysql.createConnection(configDBPe);
        console.log("Conexión exitosa a la base de datos MySQL.");
        return connection;
    } catch (error: any) {
        console.error("Error al conectar a la base de datos MySQL:", error.message);
        throw error;
    }
}

export default getConnectionMysqlPe;