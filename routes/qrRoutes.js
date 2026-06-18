const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Mock QR Entry Endpoint
router.get("/generate", protect, async (req, res) => {
  try {
    // In a real app, use a library like 'qrcode' to generate an image
    // For now, we return a mock payload string that could be encoded into a QR
    const qrData = JSON.stringify({
      userId: req.user.id,
      timestamp: Date.now(),
      action: "entry_request"
    });

    res.json({ qrData, message: "QR Code generated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
