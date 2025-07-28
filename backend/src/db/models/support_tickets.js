const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const support_tickets = sequelize.define(
    'support_tickets',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

issue_type: {
        type: DataTypes.TEXT,

      },

description: {
        type: DataTypes.TEXT,

      },

reported_at: {
        type: DataTypes.DATE,

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

  support_tickets.associate = (db) => {

    db.support_tickets.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.support_tickets.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return support_tickets;
};

