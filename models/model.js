var mysqlModel = require('mysql-model');

module.exports = mysqlModel.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'house',
});

