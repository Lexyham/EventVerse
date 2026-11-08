require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { connectDB } = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3001;
connectDB();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: ['http://localhost:3000','http://127.0.0.1:3000','http://localhost:5500',process.env.CLIENT_URL||'http://localhost:3000'], credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', rateLimit({ windowMs: 15*60*1000, max: 300, message: { error: 'Too many requests' } }));

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === (process.env.ADMIN_USERNAME||'admin') && password === (process.env.ADMIN_PASSWORD||'admin123')) {
    res.json({ success: true, adminKey: process.env.ADMIN_SECRET||'eventverse_admin_secret_2026' });
  } else { res.status(401).json({ error: 'Invalid credentials' }); }
});

app.use('/api/auth',             require('./routes/auth'));
app.use('/api/bookings',         require('./routes/bookings'));
app.use('/api/stadium-bookings', require('./routes/stadium-bookings'));
app.use('/api/merch',            require('./routes/merch'));
app.use('/api/gifts',            require('./routes/gifts'));
app.use('/api/promos',           require('./routes/promos'));
app.use('/api/notifications',    require('./routes/notifications'));
app.use('/api/admin',            require('./routes/admin'));

const PUBLIC = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC));
app.use((req, res) => {
  if (req.accepts('html')) res.status(404).sendFile(path.join(PUBLIC, '404.html'));
  else res.status(404).json({ error: 'Not found' });
});
app.use((err, req, res, _next) => { console.error(err); res.status(500).json({ error: 'Internal server error', message: err.message }); });

app.listen(PORT, () => { console.log(`\n🚀 EventVerse API → http://localhost:${PORT}`); console.log(`📂 Serving HTML from: ${PUBLIC}\n`); });
module.exports = app;
