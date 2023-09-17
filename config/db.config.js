
module.exports = {
  DB: "tmsDB",
  HOST: "localhost",
  USER: "root",
  PASSWORD: "Password123#@!",
  DIALECT: "mysql",
};

//* db4free connection
// module.exports = {
//   DB: "tmsgdb2",
//   HOST: "db4free.net",
//   USER: "tmsgdb2",
//   PASSWORD: "test0123",
//   DIALECT: "mysql",
//   PORT: 3306,
// };

//* entring connection fromm db4free
// const mysql = require('mysql');

// const pool = mysql.createPool({
//   host: 'db4free.net',
//   port: 3306,
//   user: 'tmsgdb2',
//   password: 'test0123',
//   database: 'tmsgdb2',
//   connectionLimit: 100,
//   multipleStatements: true,
// })

// module.exports = pool;