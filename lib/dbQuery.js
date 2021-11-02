const { Client } = require('pg');

const CONNECTION = {
  connectionString: process.env.DB_URL
};

function logQuery(statement, parameters) {
  const timestamp = (new Date()).toString().slice(4, 24);
  console.log('SQL', timestamp, statement, parameters);
}

async function dbQuery(statement, ...parameters) {
  const client = new Client(CONNECTION);

  await client.connect();
  logQuery(statement, parameters);
  const result = await client.query(statement, parameters);
  await client.end();

  return result;
}

module.exports = {
  dbQuery
};
