'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.addColumn('employees', 'gender',{ type: Sequelize.STRING });
     
  },

  async down (queryInterface, Sequelize) {
   
   
      await queryInterface.removeColumn('employees',"gender");
    
  }
};
