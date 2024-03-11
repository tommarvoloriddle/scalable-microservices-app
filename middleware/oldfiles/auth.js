// Authentication for the gateway

const express = require('express');

//  write custom auth middleware


const protect = (req, res, next) => {
  // check url parameters for username and password
  console.log(req.body);
  username = req.body.username ? req.body.username : req.query.username;
  password = req.body.password ?  req.body.password : req.query.password;
  
  
  if (username === 'admin' && password === 'admin') {
    req.session.authenticated = true;
    req.session.save();
    next();
  } else {
    console.log('Already authenticated', req.session, req.session.authenticated);
    if (req.session.authenticated) {
      next();
    } else {
      res.sendStatus(401);
    }
  }
};

exports.protect = protect;
// const protect = (req, res, next) => {
//     const { authenticated } = req.session;
  
//     if (!authenticated) {
//       res.sendStatus(401);
//     } else {
//       next();
//     }
//   };
  
// exports.protect = protect;