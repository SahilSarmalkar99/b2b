const mongoose = require("mongoose");


// Sub-schema for worker responses
const workerRequestSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "timeout"],
    default: "pending"
  },

  responded_at: {
    type: Date
  }

}, { _id: false });

const TicketSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },

    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },

    category: {
      type: String,
      enum: ["plumbing", "electrical"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    issue_image: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "ASSIGNED",
        "ACCEPTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "OPEN",
    },

    urgency : {
      type : String,
      enum : ["low" , "medium" , "high"],
      default : "low"
    },

    expires_at: {
    type: Date,
    index: { expires: 0 } // TTL index -> to remove automatically the exp tickets
  },

    // workers who received the ticket
  worker_requests: [workerRequestSchema],

   assigned_worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker"
  },
    
  },
  { timestamps: true },
);

const TicketModel = mongoose.model("TicketRise", TicketSchema);

module.exports =  TicketModel ;
