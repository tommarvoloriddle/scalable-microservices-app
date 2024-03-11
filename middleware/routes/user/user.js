const express = require('express');
const userfunctions = require('../../utils/createUser');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'JWT_SECRET';

router.post('/user', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);    
    user = await userfunctions.createNewUser(username, password);
    if (user) {
        const accessToken = jwt.sign({ username: user.username }, JWT_SECRET);
        // res.status(201).json({ message: "Welcome: " + user.username });
        res.status(201).json({ accessToken });
    } else {
        res.status(400).json({ message: "Incorrect Password" });
    }
});

module.exports = router;