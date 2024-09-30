import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',    // your MySQL host
  user: 'root',         // your MySQL username
//   password: 'password', // your MySQL password
  database: 'carpet', // your MySQL database name
});

export default connection;