const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    societies: [
      {
        society: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Society",
        },

        flats: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flat",
          },
        ],
      },
    ],

    profile_status: {
      type: String,
      enum: ["complete", "incomplete"],
      default: "incomplete",
    },

    verified: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    // opt session for worker verify
  },
  { timestamps: true },
);

module.exports = mongoose.model("Owner", ownerSchema);
