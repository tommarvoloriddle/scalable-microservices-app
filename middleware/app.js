const express = require('express');
const bodyParser = require('body-parser');
const passport = require('./auth/auth');
const cors = require("cors");
const {rateLimiter} = require('./ratelimiter/ratelimiter');
const logging = require('./logging/logging');

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(rateLimiter);
app.use(logging);


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });
  

// Default Route
// app.get('/', (req, res) => {
//     res.send(`
//         <form action="/user" method="POST">
//             <label for="username">Username:</label>
//             <input type="text" id="username" name="username"><br><br>
//             <label for="password">Password:</label>
//             <input type="password" id="password" name="password"><br><br>
//             <input type="submit" value="Login">
//         </form>
//     `);
// });

// User Routes
const user = require('./routes/user/user');
app.use('/', user);

// Protected Routes
const protected = require('./routes/protected/profile');
app.use('/user', passport.authenticate('jwt', {session : false}) ,protected);


// cors
app.use(cors());

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});