const mongoose = require("mongoose");

const entryLogSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date
  },


isLate:{
type:Boolean,
default:false
}

}, { timestamps: true });

entryLogSchema.index({ student: 1, checkOut: 1, createdAt: -1 });
entryLogSchema.index({ hostelId: 1, createdAt: -1 });
entryLogSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model("EntryLog", entryLogSchema);
