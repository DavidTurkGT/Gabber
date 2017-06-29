'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      "Messages",
      "userId",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "Users",
          key: "id"
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      "Messages",
      "userId"
    );
  }
};
