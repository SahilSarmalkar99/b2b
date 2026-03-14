const OwnerModel = require("../../models/owner.model");
const FlatModel = require("../../models/flat.model");


async function displayOwner(req, res) {
  try {
    const { flatId } = req.params;

    const flat = await FlatModel.findById(flatId);

    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    const owner = await OwnerModel.findById(flat.owner);

    res.json({
      owner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports = { displayOwner };
