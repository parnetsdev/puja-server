const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    required: true,
    default: "assets/user-profile-icon-free-vector.jpg",
  },
  profileName: {
    type: String,
    required: true,
  },
  profileDescription: {
    type: String,
    required: true,
  },
  languagesSpoken: {
    type: [String],
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  availableTime: {
    type: String,
    required: true,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
