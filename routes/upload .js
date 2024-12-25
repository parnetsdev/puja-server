const multer = require("multer");
const path = require("path");

// Set the path to the already existing 'uploads' directory outside 'pujaserver'
const uploadDir = path.join(__dirname, "../../uploads");

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    if (req.url.includes("/ccategories")) {
      uploadDir = path.join(__dirname, "../../uploads/category");
    } else if (req.url.includes("/pujadetails" || "/pujadetailsedit")) {
      uploadDir = path.join(__dirname, "../../uploads/homams");
    } else if (req.url.includes("/Idolsproducts")) {
      uploadDir = path.join(__dirname, "../../uploads/idols");
    } else {
      uploadDir = path.join(__dirname, "../../uploads");
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const mimeType = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure the 'uploads' directory exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Set storage engine for Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const fileTypes = /jpeg|jpg|png/;
//   const mimeType = fileTypes.test(file.mimetype);
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimeType && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"));
//   }
// };

// // Configure Multer
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
// });

// module.exports = upload;

// const path = require("path");
// const express = require("express");
// const multer = require("multer");

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.filename}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// function fileFilter(req, file, cd) {
//   const filettpes = /jpe?g|png|webp/;
//   const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

//   const extrname = filetypes.test(
//     path.extrname(file.originalname).toLoweCase()
//   );
//   const mimetype = mimetypes.test(file.mimetype);

//   if (extrname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("IMage Only"), false);
//   }
// }

// const upload = multer({ storage, fileFilter });
// const uploadSingleImage = upload.single("image");

// router.post("/", (req, res) => {
//   uploadSingleImage(req, res, function (err) {
//     if (err) {
//       return res.status(400).send({ message: err.message });
//     }

//     res.status(200).send({
//       message: "image uploaded successfully",
//       image: `/${req.file.path}`,
//     });
//   });
// });

// module.exports=router;
