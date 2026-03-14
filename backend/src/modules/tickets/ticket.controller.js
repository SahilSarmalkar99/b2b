const TicketModel = require("../../models/ticket.model");
const WorkerModel = require("../../models/worker.model");

async function TicketRise(req, res) {
  try {

    const owner_id = req.user.id;
    const { category, description, society_id, flat_id,  urgency } =
      req.body;

    if (!category || !description || !society_id || !flat_id || !owner_id) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // find all eligible workers
    const workers = await WorkerModel.find({
      skill_types: category,
      societies: society_id,
      is_active: true,
      // verification_status: "verified",
      current_tickets: { $lt: 2 }
    }).sort({ current_tickets: 1 });

    if (!workers.length) {
      return res.status(404).json({
        message: "All workers are busy right now",
      });
    }

    // expiry time
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

    // create worker request list
    const workerRequests = workers.map((worker) => ({
      worker: worker._id,
      status: "pending"
    }));

    const ticket = await TicketModel.create({
      category,
      description,
      society: society_id,
      flat: flat_id,
      owner: owner_id,
      urgency,
      expires_at: expiryTime,
      worker_requests: workerRequests
    });

    // simulate sending ticket to workers
    workers.forEach((worker) => {
      console.log(`Ticket ${ticket._id} sent to worker ${worker.name}`);
    });

    return res.status(201).json({
      success: true,
      message: "Ticket request sent to available workers",
      data: ticket,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });

  }
}

async function TicketDisplay(req , res){

  try {

    // const {id} = req.params;

    // const ticket = await TicketModel.findById(id);
    const tickets = await TicketModel.find();
    if (!tickets){
      return res.status(400).json({
        message: "Ticket Does Not Exits",
      });
    }

    res.status(201).json({
      message : "Ticket Retrive Successfully",
      ticket : tickets
    });

  } catch (error) {
    res.status(500).json({
      message : " Internal Server Error "
    })
  }
}

async function ActiveTicket(req, res) {
  try {

    const owner_id = req.user.id;

    const activeTicket = await TicketModel.find({
      owner: owner_id,
      status: { $in: ["ASSIGNED", "IN_PROGRESS"] }
    }).populate("flat society");

    res.status(200).json({
      success: true,
      tickets: activeTicket
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}

async function PendingTicket(req, res) {
  try {

    const owner_id = req.user.id;

    const pendingTicket = await TicketModel.find({
      owner: owner_id,
      status: "OPEN"
    }).populate("flat society");

    res.status(200).json({
      success: true,
      tickets: pendingTicket
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}

async function HistoryTicket(req, res) {
  try {

    const owner_id = req.user.id;

    const historyTicket = await TicketModel.find({
      owner: owner_id,
      status: { $in: ["COMPLETED", "CLOSED"] }
    })
    .sort({ createdAt: -1 })
    .populate("flat society");

    res.status(200).json({
      success: true,
      tickets: historyTicket
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}

module.exports = { TicketRise , TicketDisplay , ActiveTicket , PendingTicket , HistoryTicket};