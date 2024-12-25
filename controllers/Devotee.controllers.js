const asyncHandler = require("../middleware/asyncHandler");
const Devotee = require("../models/DevoteeSchema");

const createDevotes = asyncHandler(async (req, res) => {
  try {
    const { title, description, location, status } = req.body;
    const newDevotee = new Devotee({ title, description, location, status });
    await newDevotee.save();
    res
      .status(201)
      .json({ message: "Devotee created successfully", data: newDevotee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getDevotee = asyncHandler(async (req, res) => {
  try {
    const devotees = await Devotee.find({ status: true });
    res.status(200).json({ data: devotees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const EditDevotee = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, status } = req.body;
    const updatedDevotee = await Devotee.findByIdAndUpdate(
      id,
      { title, description, location, status },
      { new: true }
    );

    if (!updatedDevotee) {
      return res.status(404).json({ message: "Devotee not found" });
    }

    res
      .status(200)
      .json({ message: "Devotee updated successfully", data: updatedDevotee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { createDevotes, getDevotee, EditDevotee };
