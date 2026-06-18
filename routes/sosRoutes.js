const express = require("express");
const router = express.Router();
const SOS = require("../models/SOS");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const scopeFor = (req) => {
  if (req.user.role === "superAdmin") return {};
  return { hostelId: req.user.hostelId };
};

const sosPopulation = {
  path: "student",
  select: "name email room hostelId",
  populate: { path: "room", select: "roomNumber" },
};

// Student trigger SOS
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can trigger SOS alerts" });
    }

    const sos = await SOS.create({
      student: req.user.id,
      hostelId: req.user.hostelId,
      message: req.body.message || "Emergency Alert",
    });

    const populated = await SOS.findById(sos._id).populate(sosPopulation);
    res.status(201).json({ message: "SOS triggered", sos: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin view SOS alerts
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const alerts = await SOS.find(scopeFor(req))
      .populate(sosPopulation)
      .sort({ status: 1, createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve SOS
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const alert = await SOS.findOne({ _id: req.params.id, ...scopeFor(req) });

    if (!alert) {
      return res.status(404).json({ message: "SOS alert not found" });
    }

    alert.status = "Resolved";
    await alert.save();

    const populated = await SOS.findById(alert._id).populate(sosPopulation);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
