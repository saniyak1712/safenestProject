const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({

  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },

  message:{
    type:String,
    default:"Emergency Alert",
    trim:true
  },

  status:{
    type:String,
    enum:["Active","Resolved"],
    default:"Active"
  }

},{timestamps:true});

sosSchema.index({ hostelId: 1, status: 1, createdAt: -1 });
sosSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model("SOS",sosSchema);
