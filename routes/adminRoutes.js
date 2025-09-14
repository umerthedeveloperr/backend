// Routes for admin
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateTicketPdfAndSendEmail } = require("../utils/ticket");
// admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ error: "Invalid" });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid" });
  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
  res.json({ token });
});
// middleware
function auth(req, res, next) {
  const authh = req.headers.authorization;
  if (!authh) return res.status(401).json({ error: "No token" });
  const token = authh.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
}
// get bookings (all)
router.get("/bookings", auth, async (req, res) => {
  const list = await Booking.find().populate("eventId").sort({ createdAt: -1 });
  const mapped = list.map((b) => ({
    id: b._id,
    name: b.name,
    email: b.email,
    event: b.bank,
    event: b.Sender,
    event: b.paymentID,
    status: b.status,
    createdAt: b.createdAt,
    // screenshot field removed for speed
  }));
  res.json(mapped);
});
// endpoint to fetch screenshot (admin only)
// router.get("/bookings/:id/screenshot", auth, async (req, res) => {
//   const b = await Booking.findById(req.params.id);
//   if (!b || !b.paymentScreenshot) return res.status(404).send("Not found");
//   const mimeType = b.paymentScreenshot.contentType || "image/png";
//   const base64 = b.paymentScreenshot.data.toString("base64");
//   res.json({
//     screenshot: `data:${mimeType};base64,${base64}`,
//   });
// });
// confirm booking: generate PDF ticket, save PDF buffer to booking, update status, send email
router.put("/bookings/:id/confirm", auth, async (req, res) => {
  try {
    console.log(req.params)
    const b = await Booking.findById(req.params.id).populate("eventId");
    if (!b) return res.status(404).json({ error: "Not found" });
    if (b.status === "Confirmed")
      return res.status(400).json({ error: "Already confirmed" });
    // generate pdf buffer and send email
    const { pdfBuffer, filename } = await generateTicketPdfAndSendEmail(b);
    b.ticketPdf = { data: pdfBuffer, contentType: "application/pdf", filename };
    b.status = "Confirmed";
    await b.save();
    res.json({ message: "Booking confirmed" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
