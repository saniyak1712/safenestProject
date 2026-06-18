const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },

  title:{
    type:String,
    required:true,
    trim:true
  },

  description:{
    type:String,
    required:true,
    trim:true
  },

  status:{
    type:String,
    enum:["Pending","Resolved"],
    default:"Pending"
  }

},{timestamps:true});

complaintSchema.index({ hostelId: 1, status: 1, createdAt: -1 });
complaintSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model("Complaint",complaintSchema);
