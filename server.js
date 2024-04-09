const express = require('express');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/database');
const path = require('path');

const app = express();
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Configure CORS to allow requests from http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));
app.use('/api/college', require('./routes/collegeRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/tutor', require('./routes/tutorRoutes'));
app.use('/api/search', require('./routes/searchRoutes')); 
app.use('/api/availability', require('./routes/availabilityRoutes'));

// Serve the index.ejs file on the root URL
app.get('/', (req, res) => {
    res.render('index');
});

// Defining port
const PORT = process.env.PORT || 5000;
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

// Starting server
app.listen(PORT, () => console.log(`Server running on port ${PORT}: http://localhost:${PORT}`));
