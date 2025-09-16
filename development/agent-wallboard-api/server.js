require('dotenv').config();

console.log("✅ Environment loaded:");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { sendSuccess, sendError } = require('./utils/apiResponse');
const { API_MESSAGES } = require('./utils/constants');
const { Agent, agents } = require('./models/Agent');

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  return sendSuccess(res, 'Server is healthy', {
    port: process.env.PORT,
    env: process.env.NODE_ENV
  });
});

// Example error endpoint
app.get('/error-test', (req, res) => {
  return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
});


app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

app.get('/', (req, res) => {
  res.send('🚀 Agent Wallboard API is running');
});

app.get('/agents', (req, res) => {
  const allAgents = Array.from(agents.values()).map(a => a.toJSON());
  return sendSuccess(res, 'All agents fetched', allAgents);
});

// ✅ New route: Get constants
app.get('/constants', (req, res) => {
  const constantsData = {
    AGENT_STATUS,
    DEPARTMENTS,
    VALID_STATUS_TRANSITIONS
  };
  return sendSuccess(res, 'Constants fetched', constantsData);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});