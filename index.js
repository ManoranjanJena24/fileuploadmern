const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set EJS as template engine
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});
// file.mimetype.startsWith('image/')
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: fileFilter,
});

// Routes
app.get("/", (req, res) => {
  res.render("myform"); // Looks for views/myform.ejs
});

app.post(
  "/submitform",
  upload.single("userfile"),
  (req, res) => {
    if (!req.file || req.file.length === 0) {
      return res.status(400).send(`No files uploaded`);
    }

    // res.send(req.file)     //this will give very much data

    //     {
    //   "fieldname": "userfile",
    //   "originalname": "photo.jpg",
    //   "encoding": "7bit",
    //   "mimetype": "image/jpeg",
    //   "destination": "./uploads",
    //   "filename": "1756310223630.jpg",
    //   "path": "uploads\\1756310223630.jpg",
    //   "size": 194560
    // }

    res.send(req.file.filename);
  });

  app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).send(`Multer error: ${error.message}`);
    } else if (error) {
      return res.status(500).send(`Something went wrong: ${error.message}`);
    }
    next();
  });

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
