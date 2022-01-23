"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbUser.hasMany(models.tbFollow, {
        as: "followings",
        foreignKey: {
          name: "idFollowers",
        },
      });
      tbUser.hasMany(models.tbFollow, {
        as: "followers",
        foreignKey: {
          name: "idFollowings",
        },
      });
      tbUser.hasMany(models.tbFeed, {
        as: "feed",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  tbUser.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      bio: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tbUser",
    }
  );
  return tbUser;
};
