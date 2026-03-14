const SocietyModel = require("../../models/society.model");
const FlatModel = require("../../models/flat.model");
const OwnerModel = require("../../models/owner.model");
const TicketModel = require("../../models/ticket.model");

async function createSociety(req, res) {
  try {
    const {
      SocietyId,
      name,
      address,
      pincode,
      wings,
      total_flats,
      subscription_status,
      total_floors,
    } = req.body;

    if (
      !name ||
      !address ||
      !pincode ||
      total_flats == null ||
      !subscription_status
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (
      total_flats <=0
    ) {
      return res.status(400).json({
        message: "Enter Proper Range Of Flats",
      });
    }

    const isSocietyExist = await SocietyModel.findOne({
      $and: [{ name }, { address }, { pincode }],
    });

    if (isSocietyExist) {
      return res.status(400).json({
        message: "Society already exists",
      });
    }

    const newSociety = await SocietyModel.create({
      SocietyId,
      name,
      address,
      pincode,
      total_flats,
      subscription_status,
      wings,
      total_floors 
    });

    res.status(201).json({
      message: "Society created successfully",
      society: {
        id: newSociety._id,
        SID: newSociety.SocietyId,
        name: newSociety.name,
        address: newSociety.address,
        pincode: newSociety.pincode,
        total_flats: newSociety.total_flats,
        subscription_status: newSociety.subscription_status,
        wings: newSociety.wings,
        total_floors : newSociety.total_floors
      },
    });
  } catch (error) {
    console.error("Error creating society:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function displaySociety(req, res) {
  try {
    const societies = await SocietyModel.find();

    const totalResidents = await OwnerModel.countDocuments();

    const activeMaintenance = await TicketModel.countDocuments({
      status: "OPEN"
    });

    res.status(200).json({
      messgae: "Societies fetched successfully",
      societies: societies,
      totalResidents,
      activeMaintenance
    });
  } catch (error) {
    console.error("Error creating society:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function updateSociety(req, res) {
  try {
    const { id } = req.params;

    const updatedSociety = await SocietyModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updatedSociety) {
      return res.status(404).json({
        message: "Society not found",
      });
    }

    res.status(200).json({
      message: "Society updated successfully",
      society: updatedSociety,
    });
  } catch (error) {
    console.error("Error creating society:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function deleteSociety(req, res) {
  try {
    const { id } = req.params;

    const society = await SocietyModel.findById(id);

    if (!society) {
      return res.status(404).json({
        message: "Society not found",
      });
    }

    // find flats
    const flats = await FlatModel.find({ society: id });

    const flatIds = flats.map((flat) => flat._id);

    const ownerIds = flats.map((flat) => flat.owner);

    // del owner
    await OwnerModel.deleteMany({
      _id: { $in: ownerIds },
    });

    // flat del
    await FlatModel.deleteMany({
      _id: { $in: flatIds },
    });

    // del soceity
    await SocietyModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Society deleted successfully",
    });
  } catch (error) {
    console.error("Error creating society:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createSociety,
  displaySociety,
  updateSociety,
  deleteSociety,
};
