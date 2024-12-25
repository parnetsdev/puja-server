// const router = require("express").Router();
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generatetoken");
const asyncHandler = require("../middleware/asyncHandler");
const { User, validate } = require("../models/User");

// router.post("/login");
const jwt = require("jsonwebtoken");

const { default: mongoose } = require("mongoose");

//register
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body,"body");
  
  const { originalData, result } = validate(req.body);

  if (result.error) {
    return res.status(400).json({ error: result.error.details[0].message });
  }
  console.log(result.value);
  
  const { name, email, phoneNO, password,isAdmin } = result.value; // Use result.value which contains the modified data
  try {
    const doesUserAlreadyExist = await User.findOne({ email });

    if (doesUserAlreadyExist)
      return res.status(400).json({
        error: `a user with that email [${email}] already exists so please try another one.`,
      });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      phoneNO,
      password: hashedPassword,
      isAdmin
    });

    // save the user.
    const result = await newUser.save();

    result._doc.password = undefined;

    return res.status(201).json({ ...result._doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

//login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "please enter all the required fields!" });
  }

  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email)) {
    return res
      .status(400)
      .json({ error: "please enter a valid email address" });
  }

  try {
    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits) {
      return res.status(400).json({ error: "invalid email or password" });
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) {
      return res.status(400).json({ error: "invalid email or password" });
    }

    const payload = { _id: doesUserExits._id, isAdmin: doesUserExits.isAdmin };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,

      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password, "test");

//   if (!email || !password) {
//     return res
//       .status(400)
//       .json({ error: "please enter all the required fields!" });
//   }

//   const emailReg =
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//   if (!emailReg.test(email)) {
//     return res
//       .status(400)
//       .json({ error: "please enter a valid email address" });
//   }

//   try {
//     const doesUserExits = await User.findOne({ email }).select('-password');
//     console.log(doesUserExits, "doesUserExits");

//     if (!doesUserExits) {
//       return res.status(400).json({ error: "invalid email or password" });
//     }

//     const doesPasswordMatch = await bcrypt.compare(
//       password,
//       doesUserExits.password
//     );

//     if (!doesPasswordMatch) {
//       return res.status(400).json({ error: "invalid email or password" });
//     }

//     const payload = { _id: doesUserExits._id,isAdmin:doesUserExits.isAdmin };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "5d",
//     });

//     res.cookie("jwt", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 30 * 24 * 60 * 60 * 1000, //30days
//       // promo_shown attr need to add or not
//     });

//     return res.status(200).json({ token });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: err.message });
//   }
// });

//logout
const logoutUser = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "logged out successfully" });
};

//update a user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "no id specified." });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "please enter a valid id" });
  }

  const { result } = validate(req.body);
  if (result.error) {
    // Return Joi validation errors
    return res.status(400).json({ error: result.error.details[0].message });
  }

  try {
    const user = await User.findOne({ _id: id }).select("-password");

    if (!user) {
      return res.status(400).json({ error: "please mention valid Id" });
    }

    const updateData={...req.body,id:undefined};

    const result =await User.findByIdAndUpdate(id,updateData,{new:true,})

    if(result){
      const {password,isAdmin,...resposne}=result._doc;
      return res.status(200).json(resposne);
    }

    return res.status(200).json({...result._doc});

  } catch (err) {
    console.log(err);
  }
});

//single user
const specificUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified" });

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "please enter the valid id" });
  }

  try {
    const user = await User.findOne({ _id: id });


  

    return res.status(200).json({ ...user._doc });
  } catch (err) {
    console.log(err);
  }
});

//all user
const alluser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = { authUser, registerUser, logoutUser, specificUser, alluser,updateUser};

// authUser

// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   console.log("Request received:", req.body);

//   if (!email || !password) {
//     return res
//       .status(400)
//       .json({ error: "Please enter all the required fields!" });
//   }

//   try {
//     console.log("Searching for user with email:", email);
//     const user = await User.findOne({ email });
//     console.log("User Found:", user);

//     if (user && (await user.matchPassword(password))) {
//       console.log("Password matched successfully");

//       const token = jwt.sign({ UserId: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "30d",
//       });

//       res.cookie("jwt", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== "development",
//         sameSite: "strict",
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//       });

//       return res.status(200).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: token,
//       });
//     } else {
//       console.log("Invalid email or password");
//       return res.status(401).json({ error: "Invalid email or password" });
//     }
//   } catch (err) {
//     console.error("Error in authUser:", err);
//     return res.status(500).json({ error: "Server error, please try again." });
//   }
// });

// login

// const loginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Please enter all required fields!" });
//     }

//     const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailReg.test(email)) {
//       return res.status(400).json({ error: "Please enter a valid email address" });
//     }

//     try {
//       const doesUserExist = await User.findOne({ email });

//       if (!doesUserExist) {
//         return res.status(400).json({ error: "Invalid email or password" });
//       }

//       const doesPasswordMatch = await bcrypt.compare(password, doesUserExist.password);

//       if (!doesPasswordMatch) {
//         return res.status(400).json({ error: "Invalid email or password" });
//       }

//       generateToken(res, doesUserExist._id); // Generate JWT Token

//       return res.status(200).json({
//         _id: doesUserExist._id,
//         name: doesUserExist.name,
//         email: doesUserExist.email,
//         isAdmin: doesUserExist.isAdmin,
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ error: err.message });
//     }
//   });

//login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res
//       .status(400)
//       .json({ error: "please enter all the required fields!" });
//   }

//   const emailReg =
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//   if (!emailReg.test(email)) {
//     return res
//       .status(400)
//       .json({ error: "please enter a valid email address" });
//   }

//   try {
//     const doesUserExits = await User.findOne({ email });

//     if (!doesUserExits) {
//       return res.status(400).json({ error: "invalid email or password" });
//     }

//     // const doesPasswordMatch = await bcrypt.compare(
//     //   password,
//     //   doesUserExits.password
//     // );

//     if (!doesPasswordMatch) {
//       return res.status(400).json({ error: "invalid email or password" });
//     }

//     const payload = { _id: doesUserExits._id };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "5d",
//     });

//     return res.status(200).json({ token });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: err.message });
//   }
// });

// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
//   // console.log(name, email, password, "data");

//   if (!name || !email || !password)
//     return res
//       .status(400)
//       .json({ error: `please enter the all required field.` });

//   if (name.length > 25) {
//     return res
//       .status(400)
//       .json({ error: "name can only be less than character" });
//   }

//   const emailReg =
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//   if (!emailReg.test(email)) {
//     return res.status(400).json({ error: "please enter the valid email" });
//   }

//   if (password.length < 6) {
//     return res
//       .status(400)
//       .json({ error: "password must be atleast 6 character long" });
//   }
//   try {
//     const doeasUserAlreadyExist = await User.findOne({ email });

//     if (doeasUserAlreadyExist) {
//       return res
//         .status(400)
//         .json({ error: "email already exists so please try another one" });
//     }
//     // const hashedPassword = await bcrypt.hash(password, 12);
//     // const newUser = new User({ name, email, password: hashedPassword });

//     // const result = await newUser.save();

//     // result._doc.password = undefined;

//     // return res.status(201).json({ ...result._doc });

//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     if (user) {
//       generateToken(res, user._id);

//       res.status.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: err.message });
//   }
// });
