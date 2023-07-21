const jwt = require("jsonwebtoken");
const db = require("../models/index");
const Employee = db.employees;
const isAuthenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // To check if Token is Sent in Request or not
    if (!token) {
      return next(new ErrorHandler("Login Required", 401));
    }

    const tokenDecoded = await jwt.verify(token, "wrefe");


    const employee = await Employee.findByPk(tokenDecoded.id);

    console.log(req.user)
    req.user = employee;
    req.user.roleId === "1" && req.user.id == tokenDecoded.id;

    next();

  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = isAuthenticate;
