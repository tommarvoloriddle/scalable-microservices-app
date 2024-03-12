
const express = require('express');
const router = express.Router();
const axios = require('axios');
// router.get(
//     '/profile',
//     (req, res, next) => {
//       console.log(req.body, req.user);
//       res.json({
//         message: 'You made it to the secure route',
//         user: req.user,
//         token: req.query.secret_token
//       })
//     }
//   );

router.get('/profile', async (req, res, next) => {
  // call backend API
  try {
    data = await axios.post('http://localhost:4000/api/profile', {
      body : JSON.stringify({ username: 'test' }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(data.data);
    res.status(200).json(data.data);
  } catch(err) {  
    console.log(err);
    res.status(400).json({ message: "Error" });
  }

});

module.exports = router;