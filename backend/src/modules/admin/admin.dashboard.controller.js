const SocietyModel = require("../../models/society.model");
const OwnerModel = require("../../models/owner.model");
const TicketModel = require("../../models/ticket.model");

async function display(req, res) {
  try {

    const totalSocieties = await SocietyModel.countDocuments();

    const totalOwner = await OwnerModel.countDocuments();

    const activeTickets = await TicketModel.countDocuments({
      status: { $in: ["OPEN", "ASSIGNED", "ACCEPTED", "IN_PROGRESS"] }
    });

    const completedTickets = await TicketModel.countDocuments({
      status: "COMPLETED"
    });
``
    // Ticket Activity (Last 7 Days)

    const activityData = await TicketModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          tickets: { $sum: 1 }
        }
      }
    ]);

    const daysMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat"
    };

    const ticketActivity = activityData.map(item => ({
      day: daysMap[item._id],
      tickets: item.tickets
    }));


    // Recent Tickets

    const recentTickets = await TicketModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("owner", "name")
      .populate("society", "name");

    const formattedRecent = recentTickets.map(ticket => ({
      _id: ticket._id,
      resident: ticket.owner?.name || "Unknown",
      society: ticket.society?.name || "Unknown",
      category: ticket.category,
      status: ticket.status,
      date: ticket.createdAt.toISOString().split("T")[0]
    }));


    res.json({
      totalSocieties,
      totalOwner,
      activeTickets,
      completedTickets,
      ticketActivity,
      recentTickets: formattedRecent
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      error
    });

  }
}

module.exports = { display };