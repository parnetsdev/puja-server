const { required } = require("joi");
const mongoose = require("mongoose");

const SubscribeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    smallDescription: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
    TimeandDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Subscribe = mongoose.model("Subscribe", SubscribeSchema);

module.exports = Subscribe;
