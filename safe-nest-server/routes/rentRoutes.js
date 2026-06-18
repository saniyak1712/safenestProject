const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const studentScopeFor = (req, id) => {
  const base = { _id: id, role: "student" };
  if (req.user.role === "superAdmin") return base;
  return { ...base, hostelId: req.user.hostelId };
};

// ADMIN: SET RENT
router.put("/set/:id", protect, adminOnly, async (req, res) => {
  try {
    const rentAmount = Number(req.body.rentAmount);

    if (Number.isNaN(rentAmount) || rentAmount < 0) {
      return res.status(400).json({ message: "Rent amount must be a positive number" });
    }

    const user = await User.findOne(studentScopeFor(req, req.params.id));

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    user.rentAmount = rentAmount;
    user.rentDueDate = req.body.rentDueDate || null;
    user.rentPaid = false;

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: MARK RENT PAID
router.put("/pay/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findOne(studentScopeFor(req, req.params.id));

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    user.rentPaid = true;

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: VIEW RENT STATUS
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const query = req.user.role === "superAdmin"
      ? { role: "student" }
      : { role: "student", hostelId: req.user.hostelId };

    const students = await User.find(query)
      .select("-password")
      .populate("room", "roomNumber")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
