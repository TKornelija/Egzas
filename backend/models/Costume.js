const mongoose = require('mongoose');

const costumeSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  rentalPrice: Number,
  available: Boolean,
  imageUrl: String,
  category: String,
}, { timestamps: true });

module.exports = mongoose.model('Costume', costumeSchema);