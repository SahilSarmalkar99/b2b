const WorkerModel = require("../../models/worker.model");
const TicketModel = require("../../models/ticket.model");

async function WorkerProfile(req, res) {
  try {
    const { worker_id } = req.params;

    const {
      name,
      phone,
      skill_types,
      societies,
      profile_photo,
      verification_documents,
    } = req.body;

    const worker = await WorkerModel.findById({ worker_id });

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
    if (verification_documents)
      worker.verification_documents = verification_documents;

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
    const { worker_id } = req.params;
    const { skill_types } = req.body;

    const allowedSkills = ["plumbing", "electrical", "carpentry", "cleaning"];

    if (!Array.isArray(skill_types) || skill_types.length === 0) {
      return res.status(400).json({
        success: false,
        message: "skill_types must be a non-empty array",
      });
    }

    const invalidSkill = skill_types.find(
      (skill) => !allowedSkills.includes(skill)
    );

    if (invalidSkill) {
      return res.status(400).json({
        success: false,
        message: `Invalid skill type: ${invalidSkill}`,
      });
    }

    const worker = await WorkerModel.findById(worker_id);

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

async function Workerticket(req, res) {
  try {
    const { worker_id } = req.params;

    const ticket = await TicketModel.find({
      "worker_requests.worker": worker_id,
      status: "OPEN",
    }).populate("flat society owner");

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function AcceptTicket(req, res) {
  try {
    const { wid, tid } = req.params;

    const ticket = await TicketModel.findOneAndUpdate(
      {
        _id: tid,
        status: "OPEN",
      },
      {
        $set: {
          status: "ASSIGNED",
          assigned_worker: wid,
        },
      },
      { new: true },
    );

    if (!ticket) {
      return res.status(400).json({
        message: "Ticket already accepted by another worker",
      });
    }

    // Update worker request statuses
    ticket.worker_requests = ticket.worker_requests.map((req) => {
      if (req.worker.toString() === wid) {
        req.status = "accepted";
        req.responded_at = new Date();
      } else {
        req.status = "rejected";
      }
      return req;
    });

    await ticket.save();

    // Increase worker workload
    await WorkerModel.findByIdAndUpdate(wid, { $inc: { current_tickets: 1 } });

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

module.exports = { WorkerProfile, UpdateWorkerSkills , Workerticket, AcceptTicket };
