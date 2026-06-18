const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* ===============================
   REGISTER USER
=================================*/
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, hostelId } = req.body;
    const allowedRoles = ["admin", "student"];
    const normalizedRole = allowedRoles.includes(role) ? role : "student";
    const normalizedEmail = email?.toLowerCase().trim();

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
      hostelId: hostelId || null,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===============================
   LOGIN USER
=================================*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    // Gracefully migrate older/manual accounts that were inserted with
    // plaintext passwords. Once matched, immediately store a bcrypt hash.
    if (!isMatch && user.password === password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, hostelId: user.hostelId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      id: user._id,
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      hostelId: user.hostelId,
    });

} catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===============================
   SETUP SUPER ADMIN (One-time)
=================================*/
router.post("/setup-super-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingSuperAdmin = await User.findOne({ role: "superAdmin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super admin already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "superAdmin",
    });
    res.status(201).json({ message: "Super admin created", userId: superAdmin._id });
  } catch (error) {
    console.error("Setup Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
