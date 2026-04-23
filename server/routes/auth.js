const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// normalize email
const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    console.log("📩 Signup Request Body:", req.body);

    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    const role = req.body.role === "admin" ? "admin" : "student";

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔐 Password hashed");

    // create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    console.log("📌 Saving user...");

    await user.save();

    console.log("✅ User saved successfully");

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error("❌ SIGNUP ERROR:");
    console.error(error);

    res.status(500).json({
      message: "Server error",
      debug: error.message
    });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    console.log("📩 Login Request Body:", req.body);

    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    console.log("✅ Login success");

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:");
    console.error(error);

    res.status(500).json({
      message: "Server error",
      debug: error.message
    });
  }
});

module.exports = router;