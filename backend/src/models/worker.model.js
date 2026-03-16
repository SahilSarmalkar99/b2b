const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],
    },

      user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true
  },

    // Worker can have multiple skills
    skill_types: {
      type: [String],
      enum: ["plumbing", "electrical", "carpentry", "cleaning"],
      required: true,
    },

    // ID / KYC details
    verification_documents: {
      aadhar_number: {
        type: String,
      },

      id_card_photo: {
        type: String, // image url
      },
    },

    // Worker profile image
    profile_photo: {
      type: String,
    },

    // societies where worker works
    societies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Society",
      },
    ],

    // worker availability
    is_active: {
      type: Boolean,
      default: true,
    },

    // current workload
    current_tickets: {
      type: Number,
      default: 0,
    },

    // completed work photos
    completion_photos: [
      {
        ticket_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket",
        },

        photo_url: {
          type: String,
        },
      },
    ],

    completed_tickets: {
      type: Number,
      default: 0,
    },

    // Verification status
    verification_status: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },

    profile_status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
  },

  {
    timestamps: true,
  },
);

const WorkerModel = mongoose.model("Worker", workerSchema);

module.exports = WorkerModel;
