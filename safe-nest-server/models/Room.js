const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  occupants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  rent: {
    type: Number,
    required: true,
    min: 0,
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
}, { timestamps: true });

roomSchema.index({ hostelId: 1, roomNumber: 1 });

module.exports = mongoose.model("Room", roomSchema);
