var db = require("../models");

const Department = db.department;
const Employee = db.employees;

var departmentController = async (req, res) => {
    const data = await Department.findAll({
        include: [
                {
                  model: Employee,
                },
              ],
    });
    res.status(200).json({ data: data });
  };


module.exports = {
    departmentController
  };