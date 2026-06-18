const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const scopeFor = (req) => {
  if (req.user.role === "superAdmin") return {};
  return { hostelId: req.user.hostelId };
};

/* student creates complaint */
router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const complaint = await Complaint.create({
      student: req.user.id,
      title: title.trim(),
      description: description.trim(),
      hostelId: req.user.hostelId,
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* student tracks own complaints */
router.get("/my", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* admin sees complaints */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find(scopeFor(req))
      .populate("student", "name email")
      .sort({ status: 1, createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* resolve complaint */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, ...scopeFor(req) });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = "Resolved";
    await complaint.save();

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
