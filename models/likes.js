'use strict';
module.exports = function(sequelize, DataTypes) {
  var Likes = sequelize.define('Likes', {

  }, {});

  Likes.associate = (models) => {
    Likes.belongsTo(
      models.Users,
      {as: "user", foreignKey: "userId"}
    );
    Likes.belongsTo(
      models.Messages,
      {as: "message", foreignKey: "messageId"}
    );
  }

  return Likes;
};
