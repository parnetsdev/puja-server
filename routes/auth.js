const router = require("express").Router();
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generatetoken");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
// router.post("/login");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // console.log(name, email, password, "data");

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: `please enter the all required field.` });

  if (name.length > 25) {
    return res
      .status(400)
      .json({ error: "name can only be less than character" });
  }

  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email)) {
    return res.status(400).json({ error: "please enter the valid email" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "password must be atleast 6 character long" });
  }
  try {
    const doeasUserAlreadyExist = await User.findOne({ email });

    if (doeasUserAlreadyExist) {
      return res
        .status(400)
        .json({ error: "email already exists so please try another one" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    const result = await newUser.save();

    result._doc.password = undefined;

    return res.status(201).json({ ...result._doc });

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);

      res.status.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
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

    // const doesPasswordMatch = await bcrypt.compare(
    //   password,
    //   doesUserExits.password
    // );

    if (!doesPasswordMatch) {
      return res.status(400).json({ error: "invalid email or password" });
    }
    console.log("isadmin check", doesUserExits.isAdmin);

    const payload = { _id: doesUserExits._id, isAdmin: doesUserExits.isAdmin };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
