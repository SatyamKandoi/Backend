"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Employees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.DATE,
      },
      doj: {
        type: Sequelize.DATE,
      },
      phone: {
        type: Sequelize.INTEGER,
      },
      deptId: {
        type: Sequelize.INTEGER,
        references: {
          model: "departments",
        },
      },
      wstId: {
        type: Sequelize.INTEGER,
        references: {
          model: "workstatuses",
        },
      },
      gender: {
        type: Sequelize.STRING,
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "employees",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Employees");
  },
};
