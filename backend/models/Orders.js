import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      title: String,
      price: Number,
      quantity: Number,
    },
  ],

  customer: {
    firstName: String,
    lastName: String,
    email: String,
    adress: String,
    postalCode: String,
  },

  status: {
    type: String,
    enum: [
      "užsakymas pateiktas",
      "užsakymas atšauktas",
      "užsakymas išsiųstas",
      "užsakymas pristatytas",
      "užsakymas paruoštas atsiimti",
    ],
    default: "užsakymas pateiktas",
  },

  /*reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    }
  ],*/

  deliveryMethod: String,
  storeLocation: String,
  paymentMethod: String,

  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Orders", OrdersSchema);

