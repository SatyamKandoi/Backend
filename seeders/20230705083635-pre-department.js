"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "departments",
      [
        {
          departmentName: "HR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departmentName: "Account",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departmentName: "IT",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departmentName: "Maintenance",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departmentName: "Sales",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departmentName: "R & D",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
