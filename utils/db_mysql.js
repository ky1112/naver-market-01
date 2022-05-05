const mysql = require('mysql2');
const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hellomarket',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  keepAliveInitialDelay: 10000, // 0 by default.
  enableKeepAlive: true, // false by default.
};

let pool = mysql.createPool(config);

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

//const db = { convertDocToObj };

module.exports = pool.promise();
//export default db;
