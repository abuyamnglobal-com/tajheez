const { Pool } = require('pg');
const { Connector } = require('@google-cloud/cloud-sql-connector');

const connector = new Connector();

const getPool = async () => {
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
    ipType: 'PUBLIC',
  });
  const pool = new Pool({
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  return pool;
};

let pool;

module.exports = {
  query: async (text, params) => {
    if (!pool) {
      pool = await getPool();
    }
    return pool.query(text, params);
  },
};
