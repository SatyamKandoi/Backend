const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./errors/error");
var { departmentController } = require("./controllers/departmentController");
require("./models/department");
const bodyParser = require("body-parser");
const user = require("./routes/userRouter.js");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// Allow CORS in Backend
app.options("/api/login", (req, res) => {
  // Set necessary CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  // Send empty response
  res.status(204).end();
});


//To get Stats and Details about all Employees
app.get("/get", departmentController);

//User Routes 
app.use("/api", user);

//Using Error Handling Middlewares
app.use(errorMiddleware);


app.listen(8000, () => {
  console.log("App running on 8000");
});
