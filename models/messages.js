'use strict';
module.exports = function(sequelize, DataTypes) {
  var Messages = sequelize.define('Messages', {
    body: DataTypes.STRING
  }, {});

  Messages.associate = (models) => {
    Messages.belongsTo(
      models.Users,
      {as: "user", foreignKey: "userId"}
    );
    Messages.hasMany(
      models.Likes,
      {as: "likes", foreignKey: "messageId"}
    );
  }

  return Messages;
};
