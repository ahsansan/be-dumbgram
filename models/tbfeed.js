"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbFeed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbFeed.belongsTo(models.tbUser, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  tbFeed.init(
    {
      fileName: DataTypes.STRING,
      caption: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
      Like: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "tbFeed",
    }
  );
  return tbFeed;
};
