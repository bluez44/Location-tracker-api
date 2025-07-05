import mongoose from "mongoose";

export const LocationSchema = new mongoose.Schema({
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
