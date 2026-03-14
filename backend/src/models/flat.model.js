const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({

  flat_number: {
    type: String,
    required: true
  },

  wing: String,

  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society"
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner"
  }

}, { timestamps: true });

module.exports = mongoose.model("Flat", flatSchema);