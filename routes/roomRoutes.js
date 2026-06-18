const express = require("express");
const Room = require("../models/Room");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

const scopeFor = (req) => {
  if (req.user.role === "superAdmin") return {};
  return { hostelId: req.user.hostelId };
};

/* ===============================
   CREATE ROOM (Admin Only)
=================================*/
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { roomNumber, capacity, rent } = req.body;

    if (!roomNumber || !capacity || rent === undefined) {
      return res.status(400).json({ message: "Room number, capacity and rent are required" });
    }

    if (Number(capacity) < 1 || Number(rent) < 0) {
      return res.status(400).json({ message: "Capacity must be at least 1 and rent cannot be negative" });
    }

    const room = await Room.create({
      roomNumber: String(roomNumber).trim(),
      capacity: Number(capacity),
      rent: Number(rent),
      hostelId: req.user.role === "superAdmin" ? req.body.hostelId || null : req.user.hostelId,
    });

    res.status(201).json(room);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Room number already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   GET ALL ROOMS
=================================*/
router.get("/", protect, async (req, res) => {
  try {
    const rooms = await Room.find(scopeFor(req))
      .populate("occupants", "name email")
      .sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.params.id, ...scopeFor(req) });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if ((room.occupants || []).length > 0) {
      return res.status(400).json({ message: "Cannot delete an occupied room. Reassign students first." });
    }

    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   ASSIGN STUDENT TO ROOM (Admin Only)
=================================*/
router.put("/:roomId/assign/:userId", protect, adminOnly, async (req, res) => {
  try {
    const { roomId, userId } = req.params;

    const room = await Room.findOne({ _id: roomId, ...scopeFor(req) });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const userQuery = req.user.role === "superAdmin"
      ? { _id: userId }
      : { _id: userId, hostelId: req.user.hostelId };
    const user = await User.findOne(userQuery);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(400).json({ message: "Only students can be assigned" });
    }

    const alreadyInRoom = room.occupants.some((id) => id.equals(user._id));

    if (!alreadyInRoom && room.occupants.length >= room.capacity) {
      return res.status(400).json({ message: "Room is full" });
    }

    if (alreadyInRoom) {
      const populatedRoom = await Room.findById(room._id).populate("occupants", "name email");
      return res.json({ message: "Student already assigned to this room", room: populatedRoom });
    }

    if (user.room) {
      await Room.updateOne(
        { _id: user.room },
        { $pull: { occupants: user._id } }
      );
    }

    room.occupants.push(user._id);
    await room.save();

    user.room = room._id;
    user.hostelId = user.hostelId || room.hostelId || req.user.hostelId;
    await user.save();

    const populatedRoom = await Room.findById(room._id).populate("occupants", "name email");

    res.json({ message: "Student assigned successfully", room: populatedRoom });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
