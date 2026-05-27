const jwt = require("jsonwebtoken");

const generateToken = (userId, secret) =>
  jwt.sign({ userId }, secret);

module.exports = generateToken;
