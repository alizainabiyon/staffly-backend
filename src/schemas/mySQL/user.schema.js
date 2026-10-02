const { DataTypes } = require('sequelize');

const { sequelizeObject: sequelize } = require('../../lib/connections/mySQL');

module.exports = {
  schema: {
    userID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.NUMBER(),
      allowNull: false,
    },
  },
  options: {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    tableName: 'user',
    sequelize,
    modelName: 'Users',
  },
};
