const WorkerModel = require("../../models/worker.model");
const TicketModel = require("../../models/ticket.model");


async function WorkerProfile(req, res) {
  try {
    const worker_id = req.user.id;

   const worker = await WorkerModel.findOne({ user: worker_id })
  .populate("societies");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    return res.status(200).json({
      success: true,
      worker,
    });

  } catch (error) {
    console.error("WorkerProfile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


async function WorkerDashboard(req, res) {
  try {

    const worker_id = req.user.id;

    const totalTickets = await TicketModel.countDocuments({
      "worker_requests.worker": worker_id
    });

    const pendingRequests = await TicketModel.countDocuments({
      worker_requests: {
        $elemMatch: {
          worker: worker_id,
          status: "pending"
        }
      },
      status: "OPEN"
    });

    const activeTickets = await TicketModel.countDocuments({
      assigned_worker: worker_id,
      status: { $in: ["ASSIGNED", "ACCEPTED"] }
    });

    const completedTickets = await TicketModel.countDocuments({
      assigned_worker: worker_id,
      status: "COMPLETED"
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        totalTickets,
        pendingRequests,
        activeTickets,
        completedTickets
      }
    });

  } catch (error) {

    console.error("WorkerDashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
}


async function EditProfile(req, res) {
  try {
    const worker_id = req.user.id;

    const {
      name,
      phone,
      skill_types,
      societies,
      profile_photo,
      verification_documents,
    } = req.body;

    const worker = await WorkerModel.findOne({ user: worker_id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // update fields if provided
    if (name) worker.name = name.trim();
    if (phone) worker.phone = phone;
    if (skill_types) worker.skill_types = skill_types;
    if (societies) worker.societies = societies;
    if (profile_photo) worker.profile_photo = profile_photo;
    if (verification_documents) {
      worker.verification_documents = {
        ...worker.verification_documents,
        ...verification_documents,
      };
    }

    // Check profile completion
    if (
      worker.name &&
      worker.phone &&
      worker.skill_types?.length > 0 &&
      worker.societies?.length > 0 &&
      worker.profile_photo &&
      worker.verification_documents?.aadhar_number &&
      worker.verification_documents?.id_card_photo
    ) {
      worker.profile_status = "completed";
      worker.verification_status = "verified";
    } else {
      worker.profile_status = "incomplete";
      worker.verification_status = "unverified";
    }

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Worker profile updated successfully",
      worker,
    });
  } catch (error) {
    console.error("WorkerProfile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function UpdateWorkerSkills(req, res) {
  try {
    const worker_id = req.user.id;
    const { skill_types } = req.body;

    // Only check that it is an array
    if (!Array.isArray(skill_types) || skill_types.length === 0) {
      return res.status(400).json({
        success: false,
        message: "skill_types must be a non-empty array",
      });
    }

    const worker = await WorkerModel.findOne({ user: worker_id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    worker.skill_types = skill_types;

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Worker skills updated successfully",
      worker,
    });
  } catch (error) {
    console.error("updateWorkerSkills Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function WorkerPendingTickets(req, res) {
  try {

    const worker = await WorkerModel.findOne({ user: req.user.id });

    const tickets = await TicketModel.find({
      worker_requests: {
        $elemMatch: {
          worker: worker._id,
          status: "pending",
        },
      },
      status: "OPEN",
    }).populate("flat society owner");

    res.json({
      success: true,
      tickets,
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
    });

  }
}

async function WorkerActiveTickets(req, res) {
  try {

    const worker = await WorkerModel.findOne({ user: req.user.id });

    const tickets = await TicketModel.find({
      assigned_worker: worker._id,
      status: { $in: ["ASSIGNED", "IN_PROGRESS"] }
    }).populate("flat society owner");

    res.json({
      success: true,
      tickets,
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
    });

  }
}

async function AcceptTicket(req, res) {
  try {

    const user_id = req.user.id;
    const { tid } = req.params;

    // find worker using user id
    const worker = await WorkerModel.findOne({ user: user_id });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found"
      });
    }

    const wid = worker._id;

    const ticket = await TicketModel.findOneAndUpdate(
      {
        _id: tid,
        status: "OPEN",
        worker_requests: {
          $elemMatch: {
            worker: wid,
            status: "pending",
          },
        },
      },
      {
        $set: {
          status: "ASSIGNED",
          assigned_worker: wid,
        },
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(400).json({
        message: "Ticket already accepted by another worker",
      });
    }

    // Update worker request statuses
    ticket.worker_requests = ticket.worker_requests.map((request) => {
      if (request.worker.toString() === wid.toString()) {
        request.status = "accepted";
        request.responded_at = new Date();
      } else if (request.status === "pending") {
        request.status = "rejected";
      }
      return request;
    });

    await ticket.save();

    // Increase worker workload
    await WorkerModel.findByIdAndUpdate(wid, {
      $inc: { current_tickets: 1 },
    });

    return res.json({
      success: true,
      ticket,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });

  }
}
module.exports = {
  WorkerProfile,
  UpdateWorkerSkills,
  AcceptTicket,
  EditProfile,
  WorkerDashboard,
  WorkerPendingTickets,
  WorkerActiveTickets
};
