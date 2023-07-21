"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "workstatuses",
      [
        {
          workState: "WFO",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          workState: "WFH",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          workState: "Full Leave",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          workState: "Half Leave",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("workstatuses", null, {});
  },
};
