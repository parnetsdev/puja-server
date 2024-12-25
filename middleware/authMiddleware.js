const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const { User } = require("../models/User");

// const protect = asyncHandler(async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(" ")[1];

//     try {
//       // Wrap jwt.verify in a Promise to make it work with async/await
//       const payload = await new Promise((resolve, reject) => {
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(decoded);
//           }
//         });
//       });

//       const user = await User.findOne({ _id: payload._id }).select("-password");
//       req.user = user;
//       next();
//     } catch (err) {
//       console.log(err);
//       return res.status(401).json({ error: "Unauthorized!" });
//     }
//   } else {
//     return res.status(403).json({ error: "Forbidden 🛑🛑🛑" });
//   }
// });

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      // Wrap jwt.verify in a Promise to make it work with async/await
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });
      console.log(payload, "payload");

      const user = await User.findOne({ _id: payload._id }).select("-password");
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: "Unauthorized!" });
    }
  } else {
    return res.status(403).json({ error: "Forbidden 🛑🛑🛑" });
  }
};

const isAdmin = (req, res, next) => {
  // If the user is not an admin, return a 403 Forbidden response
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

module.exports = { protect, isAdmin };

// const jwt = require("jsonwebtoken");
// const asyncHandler = require("./asyncHandler");
// const User = require("../models/User");

// // module.exports= asyncHandler(async (req, res, next) => {
// //   const authHeader = req.headers.authorization;

// //   if (authHeader)
// //     {
// //     const token = authHeader.split(" ")[1];

// //     jwt.verify(token, process.env.JWT.SECRET, async (err, payload) => {
// //       try {
// //         if (err) {
// //           return res.status(401).json({ error: "Unauthorized!" });
// //         }

// //         const user = await User.findOne({ _id: payload._id }).select(
// //           "-password"
// //         );

// //         req.user = user;
// //       } catch (err) {
// //         console.log(err);

// //       }
// //     });
// //   }else{
// //     return res.status(403).json({error:"Forbidden 🛑🛑🛑"})
// //   }
// // });

// const protect = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//  console.log(authHeader,"authHeader");

//   if (authHeader) {
//     const token = authHeader.split(" ")[1];
//     console.log(token,"token");

//     jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
//       try {
//         if (err) {
//           return res.status(401).json({ error: "Unauthorized!" });
//         }

//         const user = await User.findOne({ _id: payload._id }).select(
//           "-password"
//         );

//         req.user = user;
//       } catch (err) {
//         console.log(err);
//       }
//     });
//   } else {
//     return res.status(403).json({ error: "Forbidden 🛑🛑🛑" });
//   }
// };

// module.exports = protect;
