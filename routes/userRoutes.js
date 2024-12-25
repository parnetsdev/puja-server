const express = require("express");
const {
  authUser,
  registerUser,
  logoutUser,
  specificUser,
  alluser,
  updateUser,
} = require("../controllers/userController");
const {protect,isAdmin} = require("../middleware/authMiddleware");


const router = express.Router();
// Register route
router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/alluser", alluser);

router.put("/edit",protect,updateUser);
// router.get("/user/:id", protect,allusers);
router.route("/user/:id").get(protect, specificUser);

// router.post("/logout", protect, logoutUser);
router.route("/logout").post(protect, logoutUser);

module.exports = router;
