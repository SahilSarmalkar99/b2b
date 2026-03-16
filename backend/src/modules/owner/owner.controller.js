const OwnerModel = require("../../models/owner.model");
const OtpModel = require("../../models/otp.model");
const TicketModel = require("../../models/ticket.model");
const SocietyModel = require("../../models/society.model");
const FlatModel = require("../../models/flat.model");
const mongoose = require("mongoose");

async function OwnerProfile(req, res) {
  try {
    
    const owner_id = req.user.id;
    const owner = await OwnerModel.findById({user : owner_id});

    res.status(201).json({
      message : "Owner Info",
      data : owner
    });

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

    const owner = await OwnerModel.findById({user : owner_id});

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

    const owner = await OwnerModel.findById({user : owner_id});

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

async function GetAllSocieties(req, res) {
  try {

    const societies = await SocietyModel.find();

    res.status(200).json({
      success: true,
      message: "Societies fetched successfully",
      societies
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}

async function AddSocietyToOwner(req, res) {
  try {

    const owner_id = req.user.id;
    const { society_id } = req.body;

    const owner = await OwnerModel.findOne({ user: owner_id });

    const alreadyAdded = owner.societies.find(
      s => s.society.toString() === society_id
    );

    if (alreadyAdded) {
      return res.status(400).json({
        message: "Society already added"
      });
    }

    owner.societies.push({
      society: society_id,
      flats: []
    });

    await owner.save();

    res.status(200).json({
      success: true,
      message: "Society added successfully",
      owner
    });

  } catch (error) {
    console.log
    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}

async function GetOwnerSocieties(req, res) {
  try {

    const owner_id = req.user.id;

    const owner = await OwnerModel.findOne({ user: owner_id })
      .populate("societies.society");

    res.status(200).json({
      success: true,
      societies: owner.societies
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}


async function AddFlat(req, res) {
  try {

    const owner_id = req.user.id;
    const { society_id, flat_number } = req.body;

    const owner = await OwnerModel.findOne({ user: owner_id });

    if (!owner) {
      return res.status(404).json({
        message: "Owner not found"
      });
    }

    const society = owner.societies.find(
      s => s.society.toString() === society_id
    );

    if (!society) {
      return res.status(404).json({
        message: "Society not found in owner profile"
      });
    }

    const existingFlat = await FlatModel.findOne({
      society: society_id,
      flat_number
    });

    if (existingFlat) {
      return res.status(400).json({
        message: "Flat already registered"
      });
    }

    const flat = await FlatModel.create({
      society: society_id,
      flat_number
    });

    society.flats.push(flat._id);

    // ✅ Mark profile as complete when first flat is added
    if (owner.profile_status === "incomplete") {
      owner.profile_status = "complete";
    }

    await owner.save();

    res.status(201).json({
      success: true,
      message: "Flat added successfully",
      profile_status: owner.profile_status,
      flat
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}

async function GetSocietyFlats(req, res) {
  try {

    const { society_id } = req.params;

    const flats = await FlatModel.find({
      society: society_id
    });

    const flatNumbers = flats.map(f => f.flat_number);

    res.status(200).json({
      success: true,
      flats: flatNumbers
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}

module.exports = {
  OwnerProfile,
  ProfileEdit,
  VerifyPhoneChange,
  OwnerDashboard,
  GetAllSocieties,
  AddSocietyToOwner,
  GetOwnerSocieties,
  AddFlat,
  GetSocietyFlats
};
