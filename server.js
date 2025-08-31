// Express server entry
 require('dotenv').config();
 const express = require('express');
 const mongoose = require('mongoose');
 const cors = require('cors');
 const authRoutes = require('./routes/authRoutes');
 const eventRoutes = require('./routes/eventRoutes');
 const bookingRoutes = require('./routes/bookingRoutes');
 const adminRoutes = require('./routes/adminRoutes');
 const app = express();
 app.use(cors());
 app.use(express.json({ limit: '10mb' }));
 // routes
 app.use('/api/auth', authRoutes);
 app.use('/api/events', eventRoutes);
 app.use('/api/bookings', bookingRoutes);
 app.use('/api/admin', adminRoutes);
const PORT = process.env.PORT || 5000;
 mongoose.connect(process.env.MONGO_URI)
 .then(() => {
 console.log('Mongo connected');
 app.listen(PORT, () => console.log('Server running on', PORT));
 })
 .catch(err => console.error(err));