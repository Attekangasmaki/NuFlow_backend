import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Pakotetaan ympäristömuuttujien lataaminen
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');  // Tämän pitäisi näyttää '***'
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

(async () => {
  try {
    console.log('🔹 Yritetään yhdistää tietokantaan...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,  // Nyt tämän pitäisi sisältää arvon
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log('✅ Tietokantayhteys toimii!');
    await connection.end();
  } catch (error) {
    console.error('❌ Tietokantavirhe:', error);
  }
})();
