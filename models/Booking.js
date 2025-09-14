// Booking model
const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  bank : String,
  sender : String,
  paymentID : String,
  status: { type: String, enum: ["Pending", "Confirmed"], default: "Pending" },
  ticketPdf: {
    data: Buffer,
    contentType: String,
    filename: String,
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Booking", bookingSchema);
