const express = require("express");
const bcrypt = require("bcryptjs");
const Room = require("../models/Room");
const User = require("../models/User");
const EntryLog = require("../models/EntryLog");
const Complaint = require("../models/Complaint");
const SOS = require("../models/SOS");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly, superAdminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

const scopeFor = (req) => {
  if (req.user.role === "superAdmin") return {};
  return { hostelId: req.user.hostelId };
};

const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const entryPopulation = [
  {
    path: "student",
    select: "name email room hostelId",
    populate: { path: "room", select: "roomNumber" },
  },
  { path: "room", select: "roomNumber" },
];

const normalizeEntry = (entry) => {
  const log = entry.toObject ? entry.toObject() : entry;
  if (!log.room && log.student?.room) {
    log.room = log.student.room;
  }
  return log;
};

const getDashboardStats = async (req) => {
  const queryBase = scopeFor(req);
  const { start, end } = todayRange();

  const [
    rooms,
    totalStudents,
    activeEntryLogs,
    lateEntries,
    pendingComplaints,
    totalComplaints,
    activeSos,
  ] = await Promise.all([
    Room.find(queryBase).select("capacity occupants"),
    User.countDocuments({ ...queryBase, role: "student" }),
    EntryLog.countDocuments({ ...queryBase, checkOut: null }),
    EntryLog.countDocuments({
      ...queryBase,
      checkIn: { $gte: start, $lt: end },
      isLate: true,
    }),
    Complaint.countDocuments({ ...queryBase, status: "Pending" }),
    Complaint.countDocuments(queryBase),
    SOS.countDocuments({ ...queryBase, status: "Active" }),
  ]);

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => (r.occupants || []).length > 0).length;
  const totalBeds = rooms.reduce((s, r) => s + (r.capacity || 0), 0);
  const occupiedBeds = rooms.reduce((s, r) => s + (r.occupants || []).length, 0);
  const availableRooms = Math.max(totalRooms - occupiedRooms, 0);
  const availableBeds = Math.max(totalBeds - occupiedBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return {
    totalRooms, totalStudents, occupiedRooms, availableRooms,
    totalBeds, occupiedBeds, availableBeds, occupancyRate,
    insideStudents: activeEntryLogs,
    outsideStudents: Math.max(totalStudents - activeEntryLogs, 0),
    lateEntries, pendingComplaints,
    complaints: totalComplaints,
    sos: activeSos,
  };
};

/* ── EXISTING ADMIN ROUTES (unchanged) ──────────────────────── */

router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try { res.json(await getDashboardStats(req)); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/stats", protect, adminOnly, async (req, res) => {
  try { res.json(await getDashboardStats(req)); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/outside", protect, adminOnly, async (req, res) => {
  try {
    const outside = await EntryLog.find({ ...scopeFor(req), checkOut: null })
      .populate(entryPopulation).sort({ checkIn: -1 });
    res.json(outside.map(normalizeEntry));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/late", protect, adminOnly, async (req, res) => {
  try {
    const { start, end } = todayRange();
    const late = await EntryLog.find({
      ...scopeFor(req),
      checkIn: { $gte: start, $lt: end },
      isLate: true,
    }).populate(entryPopulation).sort({ checkIn: -1 });
    res.json(late.map(normalizeEntry));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/students", protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ ...scopeFor(req), role: "student" })
      .select("-password")
      .populate("room", "roomNumber capacity rent occupants")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ── SUPER ADMIN — ADMIN MANAGEMENT ─────────────────────────── */

// GET /api/admin/all-admins
router.get("/all-admins", protect, superAdminOnly, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password").sort({ createdAt: -1 });
    res.json(admins);
  } catch (e) {
    console.error("All Admins Error:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/admin/create-admin
router.post("/create-admin", protect, superAdminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing)
      return res.status(400).json({ message: "A user with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name: name.trim(), email: normalizedEmail,
      password: hashedPassword, role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, createdAt: admin.createdAt },
    });
  } catch (e) {
    console.error("Create Admin Error:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE /api/admin/:id
router.delete("/:id", protect, superAdminOnly, async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "User not found" });
    if (admin.role !== "admin")
      return res.status(400).json({ message: "Can only delete admin accounts" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
  } catch (e) {
    console.error("Delete Admin Error:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/admin/:id/password
router.put("/:id/password", protect, superAdminOnly, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "User not found" });
    if (admin.role !== "admin")
      return res.status(400).json({ message: "Can only update admin account passwords" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error("Change Password Error:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
