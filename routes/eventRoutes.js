 const express = require('express');
 const router = express.Router();
 const Event = require('../models/Event');
 // GET all events
 router.get('/', async (req, res) => {
 try { const events = await Event.find().sort({ date: 1 }); res.json(events); }
 catch(e){ res.status(500).json({ error: 'Server error' }); }
 });
 // POST add event (you can restrict to admin later)
 router.post('/', async (req, res) => {
 try { const ev = new Event(req.body); await ev.save(); res.json(ev); }
 catch(e){ res.status(400).json({ error: 'Bad request' }); }
 });
 module.exports = router;