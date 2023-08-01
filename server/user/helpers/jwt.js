var jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";
// process.env.JWT_SECRET;
// var token = jwt.sign({ name: 'Dony Canra' }, JWT_SECRET);

const SignToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

//verify
const VerifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  SignToken,
  VerifyToken,
};
