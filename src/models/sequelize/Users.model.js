// @Dependencies
const { Model } = require('sequelize');

// @Models

// @Schema
const { schema, options } = require('../../schemas/mySQL/user.schema');

// @Helper Functions
// const { returnSuccess, errorDB } = require('../../utils/helperFunctions');

class Users extends Model {}

Users.init(schema, options);

// @Association

module.exports = Users;
