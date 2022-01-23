"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbComment.belongsTo(models.tbUser, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  tbComment.init(
    {
      idFeed: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tbComment",
    }
  );
  return tbComment;
};
