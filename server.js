const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 8080;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    return cb(null, true);
  }

  cb(null, false);
};

// Middleware
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   })
// );
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(multer({ storage, fileFilter }).single("image"));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// Route
app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode;
  const message = err.message;
  res.status(statusCode).json({ message });
});

mongoose
  .connect(config.get("MONGO_URI"), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
