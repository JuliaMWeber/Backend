const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  //user: 'mode-jwt',
  user: 'root',
  database:'node-login',
  password:'',   
});
connection.connect();
module.exports = connection;