const mysql2 = require('mysql2')

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    database: 'burgerlab',
    password: '12345',
    connectionLimit: 50
})

const promisePool = pool.promise()
module.exports = promisePool