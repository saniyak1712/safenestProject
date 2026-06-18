const express = require("express");
const Room = require("../models/Room");
const User = require("../models/User");
const EntryLog = require("../models/EntryLog");
const Complaint = require("../models/Complaint");
const SOS = require("../models/SOS");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

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
  const occupiedRooms = rooms.filter((room) => (room.occupants || []).length > 0).length;
  const totalBeds = rooms.reduce((sum, room) => sum + (room.capacity || 0), 0);
  const occupiedBeds = rooms.reduce((sum, room) => sum + ((room.occupants || []).length), 0);
  const availableRooms = Math.max(totalRooms - occupiedRooms, 0);
  const availableBeds = Math.max(totalBeds - occupiedBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return {
    totalRooms,
    totalStudents,
    occupiedRooms,
    availableRooms,
    totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate,
    insideStudents: activeEntryLogs,
    outsideStudents: Math.max(totalStudents - activeEntryLogs, 0),
    lateEntries,
    pendingComplaints,
    complaints: totalComplaints,
    sos: activeSos,
  };
};

/* ===============================
   ADMIN DASHBOARD
=================================*/
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    res.json(await getDashboardStats(req));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   ADMIN DASHBOARD STATS
=================================*/
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    res.json(await getDashboardStats(req));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   STUDENTS CURRENTLY INSIDE
=================================*/
router.get("/outside", protect, adminOnly, async (req, res) => {
  try {
    const outside = await EntryLog.find({
      ...scopeFor(req),
      checkOut: null,
    })
      .populate(entryPopulation)
      .sort({ checkIn: -1 });

    res.json(outside.map(normalizeEntry));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   LATE STUDENTS TODAY
=================================*/
router.get("/late", protect, adminOnly, async (req, res) => {
  try {
    const { start, end } = todayRange();

    const lateStudents = await EntryLog.find({
      ...scopeFor(req),
      checkIn: { $gte: start, $lt: end },
      isLate: true,
    })
      .populate(entryPopulation)
      .sort({ checkIn: -1 });

    res.json(lateStudents.map(normalizeEntry));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/students", protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ ...scopeFor(req), role: "student" })
      .select("-password")
      .populate("room", "roomNumber capacity rent occupants")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
