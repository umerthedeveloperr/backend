const express = require('express');
 const router = express.Router();
 const Admin = require('../models/Admin');
 const bcrypt = require('bcrypt');
 // helper route to create an admin (use once locally to seed an admin)
 router.post('/create-admin', async (req, res) => {
 const { email, password } = req.body;
 const existing = await Admin.findOne({ email });
 if(existing) return res.status(400).json({ error: 'Already exists' });
 const hash = await bcrypt.hash(password, 10);
 const a = new Admin({ email, passwordHash: hash });
 7
await a.save();
 res.json({ message: 'Admin created' });
 });
 module.exports = router;