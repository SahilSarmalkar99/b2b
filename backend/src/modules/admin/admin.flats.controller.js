const OwnerModel = require("../../models/owner.model");
const FlatModel = require("../../models/flat.model");
const mongoose = require("mongoose");

async function createFLat(req, res) {

  try {

    const { id } = req.params;
    const { flats } = req.body;

    if (!id || !flats || flats.length === 0) {
      return res.status(400).json({
        message: "Society ID and flats are required"
      });
    }

    const createdFlats = [];

    for (const flat of flats) {

      const { flat_number, wing, owner_name, owner_phone } = flat;

      let owner = await OwnerModel.findOne({ phone: owner_phone });

      if (!owner) {
        owner = await OwnerModel.create({
          name: owner_name,
          phone: owner_phone,
          flats: []
        });
      }

      const newFlat = await FlatModel.create({
        flat_number,
        wing,
        society: id,
        owner: owner._id
      });

      owner.flats.push(newFlat._id);
      await owner.save();

      createdFlats.push(newFlat);
    }

    res.status(201).json({
      message: "Flats created successfully",
      flats: createdFlats
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
}

async function displayFlats(req , res){

    try {
        
        const {id} = req.params;
        

        const flats = await FlatModel.find({society: new mongoose.Types.ObjectId(id)});

        if(!flats || flats.length ===0){
            return res.status(400).json({
                message : "No flats found for this society"
            })
        };

        res.status(200).json({
            message : "Flats fetched successfully",
            flats : flats
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

async function updateFlat(req ,res){

    try {
        
        const {Fid} = req.params;

        const updatedFlat = await FlatModel.findByIdAndUpdate(
            Fid,
            {$set : req.body},
            {new : true , runValidators : true}
        );

        if(!updatedFlat){
            return res.status(400).json({ message : "Flat not found" });
        };

        res.status(200).json({
            message : " Flat updated successfully",
            flat : updatedFlat
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

async function deleteFlat(req, res) {
  try {

    const { Fid } = req.params;

    const flat = await FlatModel.findById(Fid);

    if (!flat) {
      return res.status(404).json({
        message: "Flat not found",
      });
    }

    const owner = await OwnerModel.findById(flat.owner);

    // remove flat from owner
    await OwnerModel.findByIdAndUpdate(
      flat.owner,
      { $pull: { flats: Fid } },
      { new: true }
    );

    // delete flat
    await FlatModel.findByIdAndDelete(Fid);

    // check if owner still has flats
    const updatedOwner = await OwnerModel.findById(flat.owner);

    if (updatedOwner && updatedOwner.flats.length === 0) {
      await OwnerModel.findByIdAndDelete(flat.owner);
    }

    res.status(200).json({
      message: "Flat deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });

  }
}

module.exports = { createFLat , displayFlats , updateFlat , deleteFlat};