const mongoose = require("mongoose");
const Joi = require("joi");

const carouselScehma = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    backgroundImage: {
      type: String,
      required: true,
    },
    buttonType: {
      type: String,

      enum: ["Book Now", "Talk to Astrology", "Subscribe", "Buy Now"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const validateCarousel = (carosuel) => {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(2)
      .max(12)
      .pattern(/^[a-zA-Z ]+$/)
      .messages({
        "string.pattern.base": "Name must contain only letters (a-z, A-Z)!.",
        "string.min": "Name must be 2 character",
        "string.max": "Nme must be less than 12 character",
      })
      .required(),
    backgroundImage: Joi.string(),
    buttonType: Joi.string().valid(
      "Book Now",
      "Talk to Astrology",
      "Subscribe",
      "Buy Now"
    ),

    status: Joi.boolean().valid(true, false),
  });
  return schema.validate(carosuel);
};

const Carosuel = mongoose.model("Carousel", carouselScehma);

module.exports = { Carosuel, validateCarousel };
