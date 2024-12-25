const jwt = require("jsonwebtoken");

const generateToken = (res, UserId) => {
  const token = jwt.sign({ UserId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //set JWT as an HTTP-only cookie

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, //30days
    // promo_shown attr need to add or not
  });
};

module.exports = generateToken;
