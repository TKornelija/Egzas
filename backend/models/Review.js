import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    costumeId: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);