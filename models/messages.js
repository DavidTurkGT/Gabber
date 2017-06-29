'use strict';
module.exports = function(sequelize, DataTypes) {
  var Messages = sequelize.define('Messages', {
    body: DataTypes.STRING(140)
  }, {});

  //Messages associate with Users many-to-one
  Messages.associate = (models) => {
    Messages.belongsTo(models.Users, {as: "user", foreignKey: "userId"});
  }

  return Messages;
};
