require("dotenv").config({ path: "./config/config.env" });
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const express = require("express");
const cookieparser = require("cookie-parser");
const morgan = require("morgan");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const clientHomePage = require("./routes/ClientHomeRoutes");
const categoryandsubcatRoutes = require("./routes/categoryandsubcatRoutes");
const pujadetails = require("./routes/pujaServiceDetails.Routes");
const subscribe = require("./routes/subscribe.Routes");
// const subscribe = require("./routes/subscribe.Routes");
const Footer = require("./routes/Footer.Routes");
const devotees = require("./routes/Devotee.Router");
const Idohls = require("./routes/Idohls.route");
const TalktoAstroguru = require("./routes/TalktoAstroguru.Routes");
const testRoute = require("./routes/testRoute");
const app = express();
const path = require("path");
const cors = require("cors");

// Enable CORS for all origins (or specify your frontend URL)
app.use(cors()); // Allows all origins by default

// You can also customize CORS options like so:
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

//middlewares
app.use(express.json());
app.use(morgan("tiny"));

//static
// Serve static files from the 'uploads' directory
// const uploadDir = path.join(__dirname, "/uploads");

// Serve static files from the 'uploads' directory (outside 'pujaserver')
// app.use("/uploads", express.static(uploadDir));
const uploadDir = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadDir));



//routes

app.use("/api/users", userRoutes);
app.use("/api/home", clientHomePage);
app.use("/api/catsu", categoryandsubcatRoutes);
app.use("/api/pujadeta", pujadetails);
app.use("/api/sub", subscribe);
app.use("/api", Footer);
app.use("/api", devotees);
app.use("/api", TalktoAstroguru);
app.use("/api", testRoute);
app.use("/api", Idohls);

//server configurations.
const PORT = process.env.port || 8000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`server listening on port:${PORT}`);
  } catch (error) {
    console.log(error, "app establhed error");
  }
});
