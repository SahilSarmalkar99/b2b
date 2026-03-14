const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  flats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat"
    }
  ],

  profile_status: {
    type: String,
    enum:["complete" , "incomplete"],
    default: "incomplete"
  } ,
  
  verified : {
    type : String,
    enum : ["yes" , "no"],
    default : "no",
  }

// opt session for worker verify


}, { timestamps: true });

module.exports = mongoose.model("Owner", ownerSchema);