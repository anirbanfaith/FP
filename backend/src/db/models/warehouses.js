const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const warehouses = sequelize.define(
    'warehouses',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

name: {
        type: DataTypes.TEXT,

      },

city: {
        type: DataTypes.TEXT,

      },

space_available: {
        type: DataTypes.INTEGER,

      },

contact: {
        type: DataTypes.TEXT,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  warehouses.associate = (db) => {

    db.warehouses.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.warehouses.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return warehouses;
};

