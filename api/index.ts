const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

// Kết nối MongoDB và khởi động server sau khi kết nối thành công
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // Tăng timeout lên 30 giây
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Thoát server nếu kết nối thất bại
  });

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
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected" });
  }

  try {
    const { userId, latitude, longitude, timestamp } = req.body;
    const newLocation = new LocationModel({
      userId,
      latitude,
      longitude,
      timestamp,
    });
    const savedLocation = await newLocation.save();
    res.status(201).json({ message: `Location saved`, data: savedLocation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
