/**
 * createSuperAdmin.js — One-time seed script
 *
 * Usage:
 *   node createSuperAdmin.js
 *
 * Creates the initial superAdmin account if one does not already exist.
 * Run this once after deploying to Render (in the Render shell, or locally
 * with MONGO_URI pointed at Atlas).
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const SUPER_ADMIN = {
  name: "Super Admin",
  email: "admin@safenest.com",
  password: "admin123",
  role: "superAdmin",
};

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("❌  MONGO_URI is not set. Add it to your .env file.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("✅  MongoDB Connected");

  const existing = await User.findOne({ email: SUPER_ADMIN.email });
  if (existing) {
    console.log("ℹ️   Super admin already exists — nothing to do.");
    console.log(`    Email: ${SUPER_ADMIN.email}`);
    console.log(`    Role : ${existing.role}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(SUPER_ADMIN.password, 10);
  await User.create({
    name: SUPER_ADMIN.name,
    email: SUPER_ADMIN.email,
    password: hashedPassword,
    role: SUPER_ADMIN.role,
  });

  console.log("🎉  Super admin created successfully!");
  console.log(`    Name    : ${SUPER_ADMIN.name}`);
  console.log(`    Email   : ${SUPER_ADMIN.email}`);
  console.log(`    Password: ${SUPER_ADMIN.password}`);
  console.log(`    Role    : ${SUPER_ADMIN.role}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
