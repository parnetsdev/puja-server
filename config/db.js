const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose
    .connect("mongodb://localhost/puja_mern")
    .then(() => console.log("connection to database established..."))
    .catch((err) => console.log(err,"database error"));
};


module.exports=connectDB;