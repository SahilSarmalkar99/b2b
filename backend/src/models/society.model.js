const mongoose = require("mongoose");

const SocietySchema = new mongoose.Schema({

  SocietyId : {
    type : String,
    required : true,
    unique : true
  },

  name: {
    type: String,
    required: true,
    unique: true
  },

  address: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },

  total_flats: {
    type: Number,
    required: true,
  },

  total_floors :{
    type : String,
    required : true,
  },

  

  subscription_status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  wings: {
    type: [String],
    default: [],
  }
});

const SocietyModel = mongoose.model("Society", SocietySchema);

module.exports = SocietyModel;