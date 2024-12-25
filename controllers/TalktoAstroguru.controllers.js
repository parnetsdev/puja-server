const Profile = require("../models/TalktoAstroguru.Schema");

const createProfile = async (req, res) => {
  try {
    const {
      profileImage,
      profileName,
      profileDescription,
      languagesSpoken,
      pricePerHour,
      availableTime,
    } = req.body;

    const newProfile = new Profile({
      profileImage,
      profileName,
      profileDescription,
      languagesSpoken,
      pricePerHour,
      availableTime,
    });

    await newProfile.save();
    res
      .status(201)
      .json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating profile", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne(); // Fetch the first profile, you can modify this to fetch by ID if needed
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};
const editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      profileImage,
      profileName,
      profileDescription,
      languagesSpoken,
      pricePerHour,
      availableTime,
    } = req.body;

    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      {
        profileImage,
        profileName,
        profileDescription,
        languagesSpoken,
        pricePerHour,
        availableTime,
      },
      { new: true } // Return the updated profile
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you are passing the profile ID in the URL

    const deletedProfile = await Profile.findByIdAndDelete(id);
    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting profile", error: error.message });
  }
};

module.exports = { createProfile, getProfile, editProfile, deleteProfile };
