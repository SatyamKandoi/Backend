const express = require("express");
const {
  employeeController,
  createEmployee,
  register,
  login,
  updateEmployee,
  adminEmployee,
  getworkcount,
  fetchGenderRatio,
  logout,
  fetchBirthDay,
} = require("../controllers/employeeController");
const isAuthenticate = require("../middlewares/authenticate")

const router = express.Router();

router.route("/emp").get(employeeController);
router.route("/create").post(createEmployee)
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/update").post(isAuthenticate,updateEmployee)
router.route("/adminupdate").post(isAuthenticate,adminEmployee)
router.route("/wrkcount").get(getworkcount)
router.route("/gender").get(fetchGenderRatio)
router.route("/logout").post(logout)
router.route("/greeting").get(fetchBirthDay)






module.exports = router;