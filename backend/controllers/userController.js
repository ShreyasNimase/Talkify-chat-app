const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/tokens");

// REGISTER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error("User already exists");
  }

  // Cloudinary URL provided by multer
  const pic = req.file ? req.file.path : undefined;

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: accessToken,
  });
});

// LOGIN
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// controllers/userController.js

const allUsers = asyncHandler(async (req, res) => {

  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const search = req.query.search || "";

  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  }).select("-password");

  res.status(200).json(users);
});


module.exports = { registerUser, authUser, allUsers };
