const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// MongoDB URI (lấy từ MongoDB Compass)
const MONGO_URI =
  "mongodb+srv://vlqvinh444:QuangVinhlop97@cluster0.aycty9a.mongodb.net/";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

const Location = mongoose.model("Location", LocationSchema);

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(bodyParser.json());

// Endpoint nhận vị trí từ React Native
app.post("/api/locations", async (req, res) => {
  try {
    const { userId, latitude, longitude, timestamp } = req.body;
    const newLocation = new Location({
      userId,
      latitude,
      longitude,
      timestamp,
    });
    const savedLocation = await newLocation.save();
    res.status(201).json({ message: `Location saved ${savedLocation}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
