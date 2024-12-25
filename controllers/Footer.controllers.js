const asyncHandler = require("../middleware/asyncHandler");
const {SocialMedia,Contact} = require("../models/Footer.schema");

const getSocialMediaLinks = asyncHandler(async (req, res) => {
  try {
    const socialMediaLinks = await SocialMedia.findOne({ status: true });
    if (!socialMediaLinks) {
      return res.status(404).json({ message: "Social media links not found" });
    }
    res.json(socialMediaLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching social media links" });
  }
});

const updateSocialMediaLinks = asyncHandler(async (req, res) => {
  try {
    const socialMediaLinks = await SocialMedia.findOneAndUpdate(
      { status: true },
      {
        $set: {
          facebookLink: req.body.facebookLink,
          instagramLink: req.body.instagramLink,
          youtubeLink: req.body.youtubeLink,
          twitterLink: req.body.twitterLink,
        },
      },
      { new: true }
    );
    if (!socialMediaLinks) {
      return res.status(404).json({ message: "Social media links not found" });
    }
    res.json(socialMediaLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating social media links" });
  }
});

const createContact = async (req, res) => {
  const { name, address, city, email, phone } = req.body;

  try {
    const newContact = new Contact({ name, address, city, email, phone });
    await newContact.save();
    res.status(201).json({ message: 'Contact created successfully', data: newContact });
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error });
  }
};

// Get All Contacts API
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
};

// Get Contact by ID API
const getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error });
  }
};

// Update API
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, address, city, email, phone } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, address, city, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedContact) return res.status(404).json({ message: 'Contact not found' });

    res.status(200).json({ message: 'Contact updated successfully', data: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error });
  }
};

module.exports = { getSocialMediaLinks, updateSocialMediaLinks,createContact,updateContact,getContactById ,getAllContacts};
