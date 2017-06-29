'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      "Likes",
      "name"
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      "Likes",
      "name",
      {
        type: Sequelize.STRING
      }
    )
  }
};
