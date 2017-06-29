'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      "Messages",
      "body",
      {
        type: Sequelize.STRING(140),
        allowNull: false
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      "Messages",
      "body",
      {
        type: Sequelize.STRING(140)
      }
    );
  }
};
