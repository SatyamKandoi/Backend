"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Employees.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      dob: DataTypes.DATE,
      doj: DataTypes.DATE,
      gender: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      deptId: {
        type: DataTypes.INTEGER,
        references: {
          model: "departments",
        },
      },
      wstId: {
        type: DataTypes.INTEGER,
        references: {
          model: "workstatus",
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: "employees",
        },
      },
    },
    {
      sequelize,
      modelName: "Employees",
    }
  );
  return Employees;
};
