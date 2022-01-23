"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbMessage.belongsTo(models.tbUser, {
        as: "receiver",
        foreignKey: {
          name: "idReceiver",
        },
      });

      tbMessage.belongsTo(models.tbUser, {
        as: "sender",
        foreignKey: {
          name: "idSender",
        },
      });
    }
  }
  tbMessage.init(
    {
      idReceiver: DataTypes.INTEGER,
      idSender: DataTypes.INTEGER,
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "tbMessage",
    }
  );
  return tbMessage;
};
