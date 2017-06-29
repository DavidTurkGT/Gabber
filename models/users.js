'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    displayname: DataTypes.STRING
  }, {});

  Users.associate = (models) => {
    Users.hasMany(
      models.Messages,
      {as: "messages", foreignKey: "userId"}
    );
    Users.hasMany(
      models.Likes,
      {as: "likes", foreignKey: "userId"}
    );
  }


  return Users;
};
