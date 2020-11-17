const mysql = require('mysql2');

const connectionPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTIONLIMIT
});

module.exports = connectionPool.promise();