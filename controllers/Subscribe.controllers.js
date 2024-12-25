const asyncHandler = require("../middleware/asyncHandler");

const Subscribe = require("../models/SubscribeSchema");

const createSubcribe = asyncHandler(async (req, res) => {
  //   const {
  //     title,
  //     image,
  //     subtitle,
  //     smallDescription,
  //     price,
  //     location,
  //     TimeandDate,
  //   } = req.body;

  try {
    if (isNaN(new Date(req.body.TimeandDate).getTime())) {
      return res.status(400).json({ message: "Invalid TimeandDate format" });
    }

    //   subtitle: req.body.subtitle,

    const subscribe = new Subscribe({
      title: req.body.title,
      image: req.file?.filename,

      smallDescription: req.body.smallDescription,
      price: req.body.price,
      status: req.body.status,
      location: req.body.location,
      TimeandDate: new Date(req.body.TimeandDate),
    });

    await subscribe.save();

    return res
      .status(201)
      .json({ message: "successfully added", data: subscribe });
  } catch (error) {
    return res.status(500).json({ message: "Error saving subsribe data" });
  }
});

// const createSubcribe = asyncHandler(async (req, res) => {
//     try {
//       // Validate TimeandDate
//       if (isNaN(new Date(req.body.TimeandDate).getTime())) {
//         return res.status(400).json({ message: "Invalid TimeandDate format" });
//       }

//       const subscribe = new Subscribe({
//         title: req.body.title,
//         image: req.file?.filename, // Use req.file for uploaded image
//         smallDescription: req.body.smallDescription,
//         price: req.body.price,
//         status: req.body.status,
//         location: req.body.location,
//         TimeandDate: new Date(req.body.TimeandDate),
//       });

//       await subscribe.save();

//       return res
//         .status(201)
//         .json({ message: "Successfully added", data: subscribe });
//     } catch (error) {
//       console.error(error); // Log the error for debugging
//       return res
//         .status(500)
//         .json({ message: "Error saving subscribe data", error: error.message });
//     }
//   });

const getSpecificSubscribe = asyncHandler(async (req, res) => {
  const subscribeId = req.params.id;

  if (!subscribeId) {
    return res.status(400).json({ message: "Subscribe ID is required" });
  }

  try {
    const subscribe = await Subscribe.findById(subscribeId).select(
      "-status -__v"
    );
    //   .lean();

    if (!subscribe) {
      return res.status(404).json({ message: "Subscribe not found" });
    }

    res.status(200).json(subscribe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting subscribe" });
  }
});

const ToogleSubscribeStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "pls Enter a valid" });
  }

  try {
    const id = req.params.id;
    const subscribe = await Subscribe.findById(id);

    if (!subscribe) {
      return res.status(400).json({ message: "Category is not found" });
    }

    const status = !subscribe.status;

    const updateSubscribe = await Subscribe.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    if (!updateSubscribe) {
      return res.status(400).json({ message: "not able to update" });
    }

    return res.status(201).json({
      message: `Puja item ${status ? "activate" : "deactivated"}successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling Puja item status" });
  }
});

const SubscribeEdit = asyncHandler(async (req, res) => {
  const subscribeId = req.params.id;

  if (!subscribeId) {
    return res.status(400).json({ message: "Subscribe ID is required" });
  }

  try {
    const subscribe = await Subscribe.findById(subscribeId);

    if (!subscribe) {
      return res.status(404).json({ message: "Subscribe not found" });
    }

    const updatedSubscribe = await Subscribe.findByIdAndUpdate(
      subscribeId,
      {
        $set: {
          title: req.body.title || subscribe.title,
          image: req.body.image || subscribe.image,
          subtitle: req.body.subtitle || subscribe.subtitle,
          smallDescription:
            req.body.smallDescription || subscribe.smallDescription,
          price: req.body.price || subscribe.price,
          location: req.body.location || subscribe.location,
          TimeandDate: req.body.TimeandDate || subscribe.TimeandDate,
          status: req.body.status || subscribe.status,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedSubscribe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating subscribe" });
  }
});



const SubscribeDelete = asyncHandler(async (req, res) => {
  const subscribeId = req.params.id;

  if (!subscribeId) {
    return res.status(400).json({ message: "Subscribe ID is required" });
  }

  try {
    const subscribe = await Subscribe.findById(subscribeId);

    if (!subscribe) {
      return res.status(404).json({ message: "Subscribe not found" });
    }

    await Subscribe.findByIdAndDelete(subscribeId);

    res.status(200).json({ message: "Subscribe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting subscribe" });
  }
});



module.exports = {
  createSubcribe,
  getSpecificSubscribe,
  ToogleSubscribeStatus,
  SubscribeEdit,
  SubscribeDelete,
};
