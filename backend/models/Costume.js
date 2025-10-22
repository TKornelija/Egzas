const mongoose = require('mongoose');

const costumeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rentalPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      trim: true,
    },
    size: {
      type: [String], 
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Costume', costumeSchema);