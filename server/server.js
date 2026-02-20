const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./db/database');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/../')); // Serve static frontend files from root

// Initialize Database
initializeDatabase();

const lottoRoutes = require('./routes/lottoRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lotto', lottoRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
