const express = require('express');
const mongoose = require('mongoose');
const vacancyRoutes = require('./routes/vacancyRouter');
const userRoutes = require('./routes/userRouter');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json());
// const corsOptions = {
//   origin: 'https://houzzee.vercel.app/', 
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// };

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
