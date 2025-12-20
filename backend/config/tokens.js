const jwt = require("jsonwebtoken");

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
