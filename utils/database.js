import mysql from "mysql2/promise";
import "dotenv/config";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
};

const pool = mysql.createPool(dbConfig);

export const testConnection = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conexión exitosa a la base de datos");
        connection.end();
    } catch (error) {
        console.error("Error al conectar con la base de datos");
    }
};

export async function BDQuery(SQLquery, params = []) {
    try {
        const [rows] = await pool.query(SQLquery, params);
        return { code: 200, response: rows };
    } catch (error) {
        console.log(error);
        return { code: 500, response: "Error en la consulta a la Base de Datos" };
    }
}