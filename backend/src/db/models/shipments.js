const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const shipments = sequelize.define(
    'shipments',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

tracking_id: {
        type: DataTypes.TEXT,

      },

pickup_date: {
        type: DataTypes.DATE,

      },

delivery_date: {
        type: DataTypes.DATE,

      },

status: {
        type: DataTypes.ENUM,

        values: [

"Pending",

"InTransit",

"Delivered",

"Cancelled"

        ],

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

  shipments.associate = (db) => {

    db.shipments.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.shipments.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return shipments;
};

