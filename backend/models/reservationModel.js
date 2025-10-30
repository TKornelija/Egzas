import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    costume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Costume",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
},
{timestamps: true}

);

export default mongoose.model("Reservation", reservationSchema);
