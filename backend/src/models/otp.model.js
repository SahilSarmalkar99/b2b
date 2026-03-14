const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({

  phone: {
    type: String,
    required: true,
  },

  otp: String,

  expires_at: {
    type: Date,
    index: { expires: 0 }
  }

});

module.exports = mongoose.model("Otp", OtpSchema);