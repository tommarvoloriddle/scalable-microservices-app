// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Create an instance of Express
const app = express();
app.use(cors())
// Dummy data for user profiles


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });
const dummyData = {
    test: {
        username: 'test',
        name: 'Test User',
        email: 'test@example.com',
        bio: 'This is a test user.'
    }
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Route to get user profile by username
app.post('/api/profile', (req, res) => {
    const { username } = JSON.parse(req.body.body);
    console.log(username, req.body);
    if (!username || !dummyData[username]) {
        return res.status(202).json({ user: 'User not found' });
    }
    res.json(dummyData[username]);
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
