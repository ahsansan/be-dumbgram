"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbFollow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbFollow.belongsTo(models.tbUser, {
        as: "followings",
        foreignKey: {
          name: "idFollowings",
        },
      });
      tbFollow.belongsTo(models.tbUser, {
        as: "followers",
        foreignKey: {
          name: "idFollowers",
        },
      });
    }
  }
  tbFollow.init(
    {
      idFollowers: DataTypes.INTEGER,
      idFollowings: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "tbFollow",
    }
  );
  return tbFollow;
};
