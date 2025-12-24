const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Azure 3-Tier App Backend is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
