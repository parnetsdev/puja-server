const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IdolsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    textPrice1: {
      type: String,
      required: true,
      trim: true,
    },
    textPrice2: {
      type: String,
      required: true,
      trim: true,
    },
    price1: {
      type: Number,
      required: true,
    },
    price2: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Idohls = mongoose.model("Idohls", IdolsSchema);

module.exports = Idohls;
