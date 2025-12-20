const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userController");
const upload = require("../middleware/upload");
const multer = require("multer");
const { refreshToken } = require("../controllers/refreshController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", authUser);

router.post(
  "/signup",
  (req, res, next) => {
    upload.single("profileImage")(req, res, function (err) {
      
        // Multer errors (file too large, missing file, etc.)
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        return res.status(400).json({ success: false, message: err.message });
      }

      // Cloudinary-specific errors or fileFilter errors
      if (err) {
        console.error("Cloudinary Upload Error:", err);
        return res.status(400).json({ success: false, message: err.message });
      }

      next();
    });
  },
  registerUser
);

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/refresh", refreshToken);

router.get("/", protect, allUsers);


module.exports = router;
