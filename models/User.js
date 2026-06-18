const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["superAdmin", "admin", "student"],
    default: "student",
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  rentAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  rentDueDate: {
    type: Date,
  },
  rentPaid: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

userSchema.index({ role: 1, hostelId: 1 });
userSchema.index({ room: 1 });

module.exports = mongoose.model("User", userSchema);
