const OwnerModel = require("../../models/owner.model");
const OtpModel = require("../../models/otp.model");
const TicketModel = require("../../models/ticket.model");
const mongoose = require("mongoose");

async function OwnerProfile(req, res) {
  try {
    const { oid } = req.params;
  } catch (error) {
    res.status(500).json({
      message: " Internal Server Error ",
    });
  }
}

async function ProfileEdit(req, res) {
  try {
    const owner_id = req.user.id;
    const { name, phone } = req.body;

    const owner = await OwnerModel.findById(owner_id);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // update name normally
    if (name) {
      owner.name = name.trim();
    }

    // if phone is different → require OTP
    if (phone && phone !== owner.phone) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      await OtpModel.findOneAndUpdate(
        { phone },
        { otp, expires_at: expiry },
        { upsert: true },
      );

      console.log("OTP:", otp);

      return res.status(200).json({
        success: true,
        message: "OTP sent to verify new phone number",
      });
    }

    await owner.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      owner,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function VerifyPhoneChange(req, res) {
  try {
    const owner_id = req.user.id;
    const { phone, otp } = req.body;

    const otpDoc = await OtpModel.findOne({ phone });

    if (!otpDoc || String(otpDoc.otp) !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (otpDoc.expires_at < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const owner = await OwnerModel.findById(owner_id);

    owner.phone = phone;

    await owner.save();

    await OtpModel.deleteOne({ phone });

    return res.status(200).json({
      success: true,
      message: "Phone number updated successfully",
      owner,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function OwnerDashboard(req, res) {
  try {

    const owner_id = new mongoose.Types.ObjectId(req.user.id);

    const tickets = await TicketModel.find({ owner: owner_id })
      .populate("society")
      .populate("flat");

    const societiesMap = new Map();
    const flatsMap = new Map();

    tickets.forEach(ticket => {

      if (ticket.society) {
        societiesMap.set(ticket.society._id.toString(), ticket.society);
      }

      if (ticket.flat) {
        flatsMap.set(ticket.flat._id.toString(), ticket.flat);
      }

    });

    const totalTickets = tickets.length;

    const activeTickets = tickets.filter(ticket =>
      ["OPEN", "ASSIGNED", "ACCEPTED", "IN_PROGRESS"].includes(ticket.status)
    ).length;

    const completedTickets = tickets.filter(ticket =>
      ticket.status === "COMPLETED"
    ).length;

    res.status(200).json({
      success: true,
      totalTickets,
      activeTickets,
      completedTickets,
      totalSocieties: societiesMap.size,
      totalFlats: flatsMap.size,
      societies: [...societiesMap.values()],
      flats: [...flatsMap.values()]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
}

module.exports = {
  OwnerProfile,
  ProfileEdit,
  VerifyPhoneChange,
  OwnerDashboard,
};
