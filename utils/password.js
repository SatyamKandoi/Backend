const bcrypt = require("bcrypt");

//TO Check Password

const matchpassword = async (password, modelpassword) => {
  return await bcrypt.compare(password, modelpassword);
};


// TO hash Password
const hashpassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

module.exports = {
  matchpassword,
  hashpassword,
};
