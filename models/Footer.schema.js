const mongoose = require("mongoose");

const SocialMediaSchema = new mongoose.Schema(
  {
    facebookLink: {
      type: String,
    },
    instagramLink: {
      type: String,
    },
    youtubeLink: {
      type: String,
    },
    twitterLink: {
      type: String,
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

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., UMABHARATI JYOTISHAM LLP
  address: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

const SocialMedia = mongoose.model("SocialMedia", SocialMediaSchema);

module.exports = {SocialMedia,Contact};
