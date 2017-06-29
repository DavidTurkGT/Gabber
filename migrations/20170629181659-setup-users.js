'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      "Users",
      "username",
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    queryInterface.changeColumn(
      "Users",
      "password",
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    queryInterface.changeColumn(
      "Users",
      "displayname",
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      "Users",
      "username",
      {
        type: Sequelize.STRING,
      }
    );
    queryInterface.changeColumn(
      "Users",
      "password",
      {
        type: Sequelize.STRING,
      }
    );
    queryInterface.changeColumn(
      "Users",
      "displayname",
      {
        type: Sequelize.STRING,
      }
    );
  }
};
