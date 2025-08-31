// Event model
const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  price: Number,
});
module.exports = mongoose.model("Event", eventSchema);
