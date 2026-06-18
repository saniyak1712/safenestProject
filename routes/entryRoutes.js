const express = require("express");
const router = express.Router();
const EntryLog = require("../models/EntryLog");
const User = require("../models/User");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const entryPopulation = [
  {
    path: "student",
    select: "name email room hostelId",
    populate: { path: "room", select: "roomNumber" },
  },
  { path: "room", select: "roomNumber" },
];

const adminScope = (req) => {
  if (req.user.role === "superAdmin") return {};
  return { hostelId: req.user.hostelId };
};

const normalizeEntry = (entry) => {
  const log = entry.toObject ? entry.toObject() : entry;

  // Legacy safety: older logs may not have EntryLog.room, but the student can
  // still have a valid room assigned. Expose that room so the UI never falls
  // back to N/A when a real assignment exists.
  if (!log.room && log.student?.room) {
    log.room = log.student.room;
  }

  return log;
};

/* ===============================
   GET ALL ENTRY LOGS (ADMIN)
=================================*/
router.get("/logs", protect, adminOnly, async (req, res) => {
  try {
    const logs = await EntryLog.find(adminScope(req))
      .populate(entryPopulation)
      .sort({ createdAt: -1 });

    res.json(logs.map(normalizeEntry));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   CHECK IN
=================================*/
router.post("/checkin", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("room", "roomNumber hostelId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can create entry logs" });
    }

    if (!user.room) {
      return res.status(400).json({
        message: "No room assigned. Please contact the hostel admin before checking in.",
      });
    }

    const activeEntry = await EntryLog.findOne({
      student: user._id,
      checkOut: null,
    }).populate(entryPopulation);

    if (activeEntry) {
      return res.status(409).json({
        message: "You already have an active check-in",
        entry: normalizeEntry(activeEntry),
      });
    }

    const now = new Date();
    const hour = now.getHours();
    const isLate = hour >= 22;

    const entry = await EntryLog.create({
      student: user._id,
      hostelId: user.hostelId || user.room.hostelId || null,
      room: user.room._id,
      checkIn: now,
      isLate,
    });

    const populatedEntry = await EntryLog.findById(entry._id)
      .populate(entryPopulation);

    res.status(201).json(normalizeEntry(populatedEntry));

  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }
});
/* ===============================
   CHECK OUT
=================================*/
router.post("/checkout", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("room hostelId").populate("room", "roomNumber");

    const entry = await EntryLog.findOne({
      student: req.user.id,
      checkOut: null
    }).sort({ checkIn: -1 });

    if (!entry) {
      return res.status(400).json({
        message: "No active check-in"
      });
    }

    if (!entry.room && user?.room) {
      entry.room = user.room._id;
    }

    if (!entry.hostelId && user?.hostelId) {
      entry.hostelId = user.hostelId;
    }

    entry.checkOut = new Date();

    await entry.save();

    const populatedEntry = await EntryLog.findById(entry._id).populate(entryPopulation);

    res.json(normalizeEntry(populatedEntry));

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

/* ===============================
   GET ENTRY HISTORY (STUDENT)
=================================*/
router.get("/history", protect, async (req, res) => {

  try {

    const logs = await EntryLog.find({
      student: req.user.id
    })
      .populate(entryPopulation)
      .sort({ createdAt: -1 });

    res.json(logs.map(normalizeEntry));

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;
