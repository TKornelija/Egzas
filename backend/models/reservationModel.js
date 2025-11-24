import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    costumeId: {
      type: Number,
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    size: {
      type: String,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Laukiama patvirtinimo",
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
