const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

const { dbConfig } = require('../configs/index');

let sequelize = null;

function createSequelizeObject() {
  const { host, user, password, database } = dbConfig;

  return new Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    // pool: {
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    // },
    logging: false,
  });
}

async function loadSequelize() {
  try {
    sequelize = createSequelizeObject();
    await sequelize.authenticate();

    console.log('Connection established with mySQL.');

    return sequelize;
  } catch (error) {
    console.error('Failed to connect to db:', error);
    throw error;
  }
}

exports.sequelizeObject = sequelize || createSequelizeObject();

exports.sequelizeConnection = async function (event, callback) {
  // eslint-disable-line
  try {
    if (!sequelize) {
      sequelize = await loadSequelize();
      return sequelize;
    } else {
      sequelize.connectionManager.initPools();

      if (sequelize.connectionManager.hasOwnProperty('getConnection')) {
        // eslint-disable-line
        delete sequelize.connectionManager.getConnection;
      }

      return sequelize;
    }
  } catch (error) {
    console.error('Failed to connect to db:', error);
    throw error;
  } finally {
    await sequelize.connectionManager.close();
  }
};

exports.database = mysql.createPool(dbConfig).promise();
