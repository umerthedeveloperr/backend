// Routes for user
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Booking = require("../models/Booking");
// multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
// Create a booking with screenshot upload
router.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    const { name, email, eventId } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Screenshot required" });
    const booking = new Booking({
      name,
      email,
      eventId,
      paymentScreenshot: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      },
    });
    await booking.save();
    res.json({ message: "Booking created", bookingId: booking._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});
// Public: get booking status by id
router.get("/:id", async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id).populate("eventId");
    if (!b) return res.status(404).json({ error: "Not found" });
    res.json({ status: b.status });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
