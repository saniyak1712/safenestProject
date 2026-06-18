const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* ==========================================================
   Auto-seed the superAdmin account on first startup.
   This runs once after the DB connects — safe to deploy on
   Render free plan (no shell access needed).
============================================================*/
const seedSuperAdmin = async () => {
  try {
    const User = require("../models/User");

    const existing = await User.findOne({ role: "superAdmin" });
    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Super Admin",
        email: "admin@safenest.com",
        password: hashed,
        role: "superAdmin",
      });
      console.log("✅  SuperAdmin auto-created → admin@safenest.com / admin123");
    }
  } catch (err) {
    // Non-fatal — server still starts even if seed fails
    console.warn("⚠️   SuperAdmin seed skipped:", err.message);
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected");

    // Auto-seed superAdmin (idempotent — does nothing if already exists)
    await seedSuperAdmin();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
