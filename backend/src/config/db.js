const neo4j = require('neo4j-driver');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const uri = process.env.COGNODB_URI || process.env.NEO4J_URI || 'bolt://localhost:7687';
const username = process.env.COGNODB_USERNAME || process.env.NEO4J_USER || 'cognodb';
const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD || 'password';

let driver = null;

function getDriver() {
  if (!driver) {
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
      maxConnectionPoolSize: 50,
      connectionTimeout: 10000,
      disableLosslessIntegers: true
    });
  }
  return driver;
}

function getSession(mode = neo4j.session.READ) {
  const d = getDriver();
  return d.session({ defaultAccessMode: mode });
}

async function verifyConnection() {
  const session = getSession(neo4j.session.READ);
  try {
    const result = await session.run('RETURN 1 AS status');
    const isOk = result.records.length > 0 && result.records[0].get('status') === 1;
    if (isOk) {
      console.log(`[DB] Connected successfully to graph database at ${uri}`);
      return { connected: true, uri };
    }
    return { connected: false, uri, error: 'Unexpected return value' };
  } catch (err) {
    console.error(`[DB Warning] Could not connect to CognoDB/Neo4j at ${uri}: ${err.message}`);
    return { connected: false, uri, error: err.message };
  } finally {
    await session.close();
  }
}

async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
    console.log('[DB] Closed graph driver connection pool.');
  }
}

module.exports = {
  getDriver,
  getSession,
  verifyConnection,
  closeDriver,
  neo4j
};
