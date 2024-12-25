const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: { type: String },
    smallDescription: { type: String, default: "" },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model("Subcategory", subCategorySchema);
const Category = mongoose.model("Category", categorySchema);

const validateCategory = (category) => {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(2)
      .max(20)
      .pattern(/^[a-zA-Z ]+$/)
      .messages({
        "string.pattern.base": "Name must contain only letters (a-z, A-Z)!.",
        "string.min": "Name must be at least 2 characters.",
        "string.max": "Name must be less than 20 characters.",
      })
      .required(),
    image: Joi.string(),
    smallDescription: Joi.string().trim().min(2).max(70).messages({
      "string.min": "Description must be at least 2 characters.",
      "string.max": "Description must be less than 70 characters.",
    }),
    status: Joi.boolean().valid(true, false),
  });
  return schema.validate(category);
};

const validateSubCategory = (subCategory) => {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(2)
      .max(18)
      .pattern(/^[a-zA-Z ]+$/)
      .messages({
        "string.pattern.base": "Name must contain only letters (a-z, A-Z)!.",
        "string.min": "Name must be at least 2 characters.",
        "string.max": "Name must be less than 18 characters.",
      })
      .required(),
    category: Joi.string().required(),
    status: Joi.boolean().valid(true, false),
  });
  return schema.validate(subCategory);
};

module.exports = {
  Category,
  SubCategory,
  validateCategory,
  validateSubCategory,
};
