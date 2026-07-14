const mysql = require('mysql')

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "phonehub"
})

db.on('connection', function (connection) {
  connection.query('SET SESSION wait_timeout = 28800');
  connection.query('SET SESSION interactive_timeout = 28800');
});

module.exports = db