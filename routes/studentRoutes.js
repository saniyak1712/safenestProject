const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("room", "roomNumber capacity rent occupants");

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/notifications", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    const notifications = [];
    
    // Rent Notification Logic
    if (user.rentAmount > 0 && user.rentDueDate && !user.rentPaid) {
      const now = new Date();
      const dueDate = new Date(user.rentDueDate);
      const diffTime = Math.abs(now - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (now > dueDate) {
        notifications.push({ id: "rent-overdue", type: "danger", message: `Your rent of Rs. ${user.rentAmount} is overdue by ${diffDays} day${diffDays === 1 ? "" : "s"}.` });
      } else if (diffDays <= 5) {
        notifications.push({ id: "rent-due", type: "warning", message: `Your rent of Rs. ${user.rentAmount} is due in ${diffDays} day${diffDays === 1 ? "" : "s"}.` });
      }
    }

    notifications.push({
      id: "announcement-quiet-hours",
      type: "info",
      message: "Quiet hours begin at 10:00 PM. Late entries are automatically flagged.",
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
