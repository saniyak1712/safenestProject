const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Mock Chatbot Endpoint
router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;
    let reply = "I'm sorry, I didn't understand that. Please contact the hostel admin.";
    
    const msg = message.toLowerCase();
    
    if (msg.includes("rent")) {
      reply = "You can check your rent dues in the 'Overview' tab of your dashboard.";
    } else if (msg.includes("complaint") || msg.includes("issue")) {
      reply = "Please raise a ticket in the 'Raise Complaint' section and our staff will resolve it ASAP.";
    } else if (msg.includes("check in") || msg.includes("late")) {
      reply = "Make sure to check in before 10:00 PM to avoid a late entry mark.";
    } else if (msg.includes("hello") || msg.includes("hi")) {
      reply = "Hello! I am the SafeNest Assistant. How can I help you today?";
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
