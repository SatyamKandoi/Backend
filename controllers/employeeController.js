var db = require("../models");
const { matchpassword, hashpassword } = require("../utils/password");
const { generatetoken } = require("../utils/jwttoken");
const ErrorHandler = require("../utils/errorhandler");

// Getting All the Models
const Department = db.department;
const Employee = db.employees;
const WorkStatus = db.workStatus;
const Address = db.address;
const Role = db.role;

//To Get all Employees
var employeeController = async (req, res) => {
  const data = await Employee.findAll({
    include: [
      { model: WorkStatus, as: "workStatus" },
      { model: Department, as: "department" },
      { model: Address, as: "address" },
    ],
  });
  res.status(200).json({ data: data });
};

// For Admin To Create a New Employee
const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      dob,
      doj,
      phone,
      deptId,
      wstId,
      street,
      city,
      state,
      pincode,
      type,
    } = req.body;

    const data = await Address.create(
      {
        street,
        city,
        state,
        pincode,
        type,
        employee: {
          firstName,
          lastName,
          email,
          password,
          gender,
          dob: new Date(dob).toString(),
          doj: new Date(doj).toString(),
          phone,
          deptId,
          wstId,
        },
      },
      {
        include: [db.empAddBind],
      }
    );
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// To Implement Register Functionality
const register = async (req, res) => {
  const { firstName, email, password } = req.body;
  try {
    let user = await Employee.findOne({ where: { email: email } });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Employee Already Exist" });
    }
    const hash = hashpassword(password);
    let employee = await Employee.create({ firstName, email, password: hash });
    const token = await generatetoken(employee.id);
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    };
    console.log({ token });
    res
      .status(200)
      .cookie("token", token, options, { signed: true })
      .json({ message: "Employee created.", token: token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// TO implement Login and Logout
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //To find Existing Employee
    let employee = await Employee.findOne({
      where: { email: email },
      include: [
        { model: Department, as: "department" },
        { model: WorkStatus, as: "workStatus" },
        { model: Address, as: "address" },
        { model: Role, as: "role" },
      ],
    });

    // TO check if Employee Exist or Not
    if (!employee) {
      return next(new ErrorHandler("User is not Found", 404));
    }
    // To check Password
    const ismatch = await matchpassword(password, employee.password);
    if (!ismatch) {
      return next(new ErrorHandler("Password Does Not match", 400));
    }

    // To Generate JWT Token
    const token = await generatetoken(employee.id);
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    //Set token and Send Response

    res.status(201).cookie("token", token, options).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({ message: "Logged out." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Get Details about Employees Work From Office Or Work From Home
const getworkcount = async (req, res) => {
  let data = await WorkStatus.findAll({
    attributes: [
      "id",
      ["workState", "label"],
      [db.Sequelize.fn("COUNT", db.Sequelize.col("Employees.id")), "value"],
    ],
    include: [{ model: Employee, attributes: [] }],
    group: ["WorkStatus.id"],
  });
  res.send(data);
};
// Get Details about Gender and Ratio of Male and Female
const fetchGenderRatio = async (req, res) => {
  try {
    const { count: male, rows: maleRows } = await Employee.scope(
      "getMale"
    ).findAndCountAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("gender")), "count"],
      ],
    });
    const { count: female, rows: femaleRows } = await Employee.scope(
      "getFemale"
    ).findAndCountAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("gender")), "count"],
      ],
    });

    console.log(maleRows);

    res.status(200).json([
      { id: 1, label: "male", value: male },
      { id: 1, label: "female", value: female },
    ]);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateEmployee = async (req, res) => {
  try {
    let { roleId, current, permenant, ...employeePayload } = req.body;

    if (roleId) {
      roleId = 1;
    }

    const employeeUpdate = await Employee.update(
      {
        roleId: roleId,
        ...employeePayload,
      },
      { where: { id: req.user.id } }
    );
    if (!!employeeUpdate) {
      const addressExists = await Address.findAll({
        where: { empID: req.user.id },
        attributes: { exclude: ["password"] },
      });
      if (addressExists.length === 0) {
        //create new address.
        current &&
          (await Address.create({
            empId: req.user.id,
            ...current,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
          }));
        permenant &&
          (await Address.create({
            empId: req.user.id,
            ...permenant,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
          }));
      } else {
        // update appropriate address, current ,permanent or both.
        current &&
          (await Address.update(
            { ...current },
            { where: { empId: req.user.id, type: "current" } }
          ));
        permenant &&
          (await Address.update(
            { ...permenant },
            { where: { empId: req.user.id, type: "permenant" } }
          ));
      }
    }
    res.status(200).json({ message: "Profile updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminEmployee = async (req, res) => {
  try {
    const { current, permanent, ...employeePayload } = req.body;
    console.log(req.user.id);
    console.log(employeePayload);
    const employeeUpdate = await Employee.update(
      {
        ...employeePayload,
      },
      { where: { id: employeePayload.id } }
    );
    if (!!employeeUpdate) {
      const addressExists = await Address.findAll({
        where: { empID: req.user.id },
      });
      if (addressExists.length === 0) {
        //create new address.
        current &&
          (await Address.create({
            empId: req.user.id,
            ...current,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
          }));
        permanent &&
          (await Address.create({
            empId: req.user.id,
            ...permanent,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
          }));
      } else {
        // update appropriate address, current ,permanent or both.
        current &&
          (await Address.update(
            { ...current },
            { where: { empId: req.user.id, type: "current" } }
          ));
        permanent &&
          (await Address.update(
            { ...permanent },
            { where: { empId: req.user.id, type: "permanent" } }
          ));
      }
    }
    res.status(200).json({ message: "Profile updated." });
  } catch (error) {
    res.status(500).json({ message: "This Also" });
  }
};

const fetchBirthDay = async (req, res) => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // Adding 1 to get 1-based month
    const todayDate = today.getDate();

    const employees = await Employee.findAll({
      where: db.sequelize.where(
        db.Sequelize.fn("MONTH", db.Sequelize.col("dob")),
        todayMonth
      ),
      where: db.sequelize.where(
        db.sequelize.fn("DAY", db.sequelize.col("dob")),
        todayDate
      ),
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logout,
  employeeController,
  updateEmployee,
  createEmployee,
  getworkcount,
  register,
  login,
  fetchGenderRatio,
  fetchBirthDay,
  adminEmployee,
};
