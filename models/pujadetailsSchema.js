const { required, boolean } = require("joi");
const mongoose = require("mongoose");
const {
  SubCategory,
  Category,
} = require("../models/categoryAndSubcategorySchema");
const Schema = mongoose.Schema;

const HomamOptionSchema = new Schema({
  name: { type: String, required: true, trime: true },
  noOfPriests: { type: Number, required: true, trime: true },
  noOfChants: { type: Number, required: true, trime: true },
  time: { type: String, required: true },
  charges: { type: String, required: true },
});

const PujaDetailsSchema = new Schema({
  availableDates: [{ type: Date, required: true }],
  name: { type: String, required: true },
  nakshatra: { type: String, required: true },
  rasi: { type: String, required: true },
  additionalInfo: { type: String },
});

const PujaSchema = new Schema({
  title: { type: String, required: true, unique: true, trim: true },
  image: { type: String, default: "uploads/default/product-placeholder.png" },
  CardpriceDisplay: { type: Number },
  description: { type: String, required: true, trime: true },
  homamOptions: [HomamOptionSchema],
  pujaDetails: PujaDetailsSchema,
  status: { type: Boolean, default: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});



const Puja = mongoose.model("Puja", PujaSchema);
module.exports = Puja;
