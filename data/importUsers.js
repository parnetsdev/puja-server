const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const User = require("../models/User"); 

// Connect to Local MongoDB
mongoose.connect("mongodb://localhost:27017/puja_mern", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB locally"))
.catch((err) => console.error("Error connecting to MongoDB:", err));

// Read the JSON file containing the users data
const usersData = JSON.parse(fs.readFileSync("./user.json", "utf-8"));

async function importUsers() {
  for (let userData of usersData) {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      isAdmin: userData.isAdmin || false, // Default to false if isAdmin is not provided
    });

    // Save the user to the database
    try {
      await newUser.save();
      console.log(`User ${userData.name} added successfully`);
    } catch (error) {
      console.error(`Error adding user ${userData.name}:`, error);
    }
  }

  mongoose.disconnect(); // Disconnect once done
}

importUsers();
