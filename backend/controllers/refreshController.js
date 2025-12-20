const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token user" });
    }

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    res.json({ token: newAccessToken });
  } catch (err) {
    console.error("Refresh token validation failed:", err);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
