import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '3228BC',
  database: 'lawarna_portfolio'
};

async function check() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute('SELECT id, caption FROM lifestyle_posts');
  console.log('LIFESTYLE POSTS IN DB:', rows);
  await connection.end();
}

check().catch(console.error);
