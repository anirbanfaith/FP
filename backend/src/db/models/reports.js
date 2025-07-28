const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const reports = sequelize.define(
    'reports',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

type: {
        type: DataTypes.ENUM,

        values: [

"Bookings",

"Revenue",

"PartnerPickups",

"ShipmentVolumes"

        ],

      },

start_date: {
        type: DataTypes.DATE,

      },

end_date: {
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

  reports.associate = (db) => {

    db.reports.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.reports.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return reports;
};

