'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    displayname: DataTypes.STRING
  }, {});

  //Users associate with messages one-to-many
  Users.associate = (models) => {
    Users.hasMany(models.Messages, {as: "messages", foreignKey: "userId"});
  }

  return Users;
};
