const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter the name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
    },
    phoneNO: {
      type: Number,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required."],
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// UserSchema.pre("save", async function (next) {
//   console.log("Before Hashing:", this.password);

//   if (!this.isModified("password")) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);

//   console.log("After Hashing:", this.password);
//   next();
// });

const validate = (data) => {
  const originalData = { ...data };
  const modifiedData = { ...data };
  modifiedData.name = modifiedData.name.replace(/\s+/g, " ");
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z]+$/)
      .min(4)
      .max(25)
      .messages({
        "string.min": "name length must be at least 4 characters long",
        "string.max": "name length must be less than 25 characters long",
        "string.pattern.base": "Name must contain only letters (a-z, A-Z).",
      })
      .required(),
    email: Joi.string()
      .trim()
      .email()
      .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@gmail.com$"))
      .message({
        "string.pattern.base": "Only Gmail domain email IDs are allowed.",
      })
      .required(),
    phoneNO: Joi.number()

      .integer()
      .min(1000000000)
      .max(9999999999)
      .required()
      .messages({
        "number.min": "Phone number must be 10 digits",
        "number.max": "Phone number must be 10 digits",
      }),
    password: Joi.string()
      .trim()
      .min(5)
      .max(15)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,15}$"
        )
      )
      .messages({
        "string.pattern.base":
          "Password must contain at least one letter, one number, and one special character",
        "string.min": "password must be 5 character",
        "string.max": "password must be less than 15 character",
      })
      .required(),
      isAdmin:Joi.boolean()
  });
  return { originalData, result: schema.validate(modifiedData) };
};

module.exports = { User, validate };
