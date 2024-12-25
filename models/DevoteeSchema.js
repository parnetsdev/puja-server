const mongoose = require("mongoose");

const DevoteeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: "true",
  },
});

const Devotee = mongoose.model("Devotee", DevoteeSchema);

module.exports = Devotee;
