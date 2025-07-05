import mongoose from "mongoose";
import { LocationSchema } from "../schema/Location";

export const LocationModel = mongoose.model("Location", LocationSchema);