const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const { verifyConnection } = require('./config/db');

const connectionRoutes = require('./routes/connectionRoutes');
const actorRoutes = require('./routes/actorRoutes');
const movieRoutes = require('./routes/movieRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await verifyConnection();
  res.status(dbStatus.connected ? 200 : 503).json({
    status: dbStatus.connected ? 'healthy' : 'degraded',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/connection', connectionRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api', searchRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]', err.stack || err.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred in MovieGraph API.'
  });
});

// Start Server
app.listen(PORT, async () => {

  console.log(` \n MovieGraph Backend Server running on port ${PORT}`);
  console.log(` API Check: http://localhost:${PORT}/api/health \n `);
 
  
  await verifyConnection();
});

module.exports = app;
