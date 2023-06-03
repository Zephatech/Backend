const Pool = require('pg').Pool

// const pool = new Pool({
//   user: 'your_username',
//   password: 'your_password',
//   host: 'localhost',
//   port: 5432,
//   database: 'your_database',
// });

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'admin',  
  password: 'test',
  database: 'api',
})


module.exports = pool;
