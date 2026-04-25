import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lawarna_portfolio',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log(`mySQL connected to db : ${process.env.DB_NAME}`);

        connection.release();
    })

    .catch(err => {
        console.error(`mySQL connection error : `, err.message)
    });

export default pool;
