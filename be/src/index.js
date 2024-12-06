const express = require('express');
const mongoose = require('mongoose');
const vacancyRoutes = require('./routes/vacancyRouter');
const userRoutes = require('./routes/userRouter'); // Assuming you already have this
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json()); // For parsing JSON requests
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with the frontend URL
  credentials: true, // Allow cookies if required
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/users', userRoutes); // For user authentication and management

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
