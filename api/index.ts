import { start } from "repl";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

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
  vehicleNumber: String,
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
        serverSelectionTimeoutMS: 20000, // 10s timeout
      });
    }

    const {
      userId,
      latitude,
      longitude,
      timestamp,
      city,
      country,
      district,
      formattedAddress,
      isoCountryCode,
      name,
      postalCode,
      region,
      street,
      streetNumber,
      subregion,
      timezone,
      vehicleNumber,
    } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(404)
        .json({ error: "Latitude and longitude are required", status: 404 });
    }

    // Đảm bảo chỉ chạy đoạn này nếu kết nối thành công
    const newLocation = new LocationModel({
      userId,
      latitude,
      longitude,
      timestamp,
      city,
      country,
      district,
      formattedAddress,
      isoCountryCode,
      name,
      postalCode,
      region,
      street,
      streetNumber,
      subregion,
      timezone,
      vehicleNumber,
    });

    const savedLocation = await newLocation.save();
    res
      .status(200)
      .json({ message: "Location saved", data: savedLocation, status: 200 });
  } catch (err) {
    // Bắt tất cả lỗi: kết nối DB, lưu dữ liệu, hoặc lỗi không mong muốn
    res
      .status(500)
      .json({ error: err.message || "Internal Server Error", status: 500 });
  }
});

app.get("/api/locations", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 20000, // 20s timeout
      });
    }

    const locations = await LocationModel.find({
      vehicleNumber: req.query.vehicleNumber,
    })
      .sort({ timestamp: 1 })
      .limit(req.query.limit || 0);

    res.status(200).json({ data: locations, status: 200 });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message || "Internal Server Error", status: 500 });
  }
});

app.get("/api/locations/today", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 20000, // 20s timeout
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    startOfDay.setTime(startOfDay.getTime() - 7 * 60 * 60 * 1000); // lùi 7 giờ

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    endOfDay.setTime(endOfDay.getTime() - 7 * 60 * 60 * 1000); // lùi 7 giờ

    const locations = await LocationModel.find({
      timestamp: { $gte: startOfDay, $lte: endOfDay },
      vehicleNumber: req.query.vehicleNumber,
    })
      .sort({ timestamp: 1 })
      .limit(req.query.limit || 0);

    res.status(200).json({
      data: locations,
      status: 200,
      date: {
        start: startOfDay,
        end: endOfDay,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message || "Internal Server Error", status: 500 });
  }
});

app.get("/api/locations/date-range", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 20000, // 20s timeout
      });
    }

    const startDate = new Date(req.query.startDate);
    startDate.setHours(0, 0, 0, 0);
    startDate.setTime(startDate.getTime() - 7 * 60 * 60 * 1000); // lùi 7 giờ

    const endDate = new Date(req.query.endDate);
    endDate.setHours(0, 0, 0, 0);
    endDate.setTime(endDate.getTime() - 7 * 60 * 60 * 1000); // lùi 7 giờ

    const locations = await LocationModel.find({
      timestamp: { $gte: startDate, $lte: endDate },
      vehicleNumber: req.query.vehicleNumber,
    })
      .sort({ timestamp: 1 })
      .limit(req.query.limit || 0);

    res.status(200).json({
      data: locations,
      status: 200,
      date: {
        start: startDate,
        end: endDate,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message || "Internal Server Error", status: 500 });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

module.exports = app;
