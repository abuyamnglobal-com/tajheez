const { Pool } = require('pg');
const { Connector } = require('@google-cloud/cloud-sql-connector');

const connector = new Connector();

const pool = new Pool({
  // The Cloud SQL JS Connector returns a new promise on every invocation,
  // so we need to wrap it in a function that returns the same promise.
  stream: () => {
    if (pool.streamPromise) {
      return pool.streamPromise;
    }
    pool.streamPromise = connector.getStream({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
      ipType: 'PUBLIC', // or 'PRIVATE'
    });
    return pool.streamPromise;
  },
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};