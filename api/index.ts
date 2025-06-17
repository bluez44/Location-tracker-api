const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(bodyParser.json());

// Schema và Model
const LocationSchema = new mongoose.Schema({
  userId: String,
  latitude: Number,
  longitude: Number,
  timestamp: Date,
  city: String,
  country: String,
  district: String,
  formattedAddress: String,
  isoCountryCode: String,
  name: String,
  postalCode: String,
  region: String,
  street: String,
  streetNumber: String,
  subregion: String,
  timezone: String,
});

const LocationModel = mongoose.model("Location", LocationSchema);

// Routes
app.get("/", (req, res) => res.send("Express on Vercel"));

// Endpoint nhận vị trí
app.post("/api/locations", async (req, res) => {
  try {
    // Nếu chưa kết nối thì kết nối và chờ kết nối thành công
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // 10s timeout
      });
    }

    const { userId, latitude, longitude, timestamp } = req.body;

    // Đảm bảo chỉ chạy đoạn này nếu kết nối thành công
    const newLocation = new LocationModel({
      userId,
      latitude,
      longitude,
      timestamp,
    });

    const savedLocation = await newLocation.save();
    res.status(201).json({ message: "Location saved", data: savedLocation });
  } catch (err) {
    // Bắt tất cả lỗi: kết nối DB, lưu dữ liệu, hoặc lỗi không mong muốn
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);


module.exports = app;
