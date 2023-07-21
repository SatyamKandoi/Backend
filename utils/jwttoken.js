const jwt = require("jsonwebtoken")

// To Generate Token 
const generatetoken=async(id)=>{
let token = jwt.sign({ id:id }, "wrefe");
return token
}

module.exports = {
    generatetoken
};

