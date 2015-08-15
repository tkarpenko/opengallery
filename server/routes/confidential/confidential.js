var express = require('express');

// include Router middleware 
// to create modular mountable route handlers
// for /api/v1/confidential/...
var confidential = express.Router();

// We will use constants from config.js
var config = require('../../helpers/config');

// Include module for JSON Web Token authentication 
var jwt = require('jsonwebtoken');

/**
  Route middleware to verify a session token which is sended from client.
*/
confidential.use(function(req, res, next) {

  // Check header for token
  var token = req.headers['x-access-token'];
  
  // If token is sended from client
  if (token) {

    // verify it by using secret word known only on server side of app
    jwt.verify(token, config.secretToken, function(err, decoded) {      
      if (err) {
        return res.status(401).send({error: 'Failed to authenticate token.'});    
      } else {
        // if everything is good program lets go to private (confidential) routes   
        next();
      }
    });

  // if there is no token return an error
  } else {
    return res.status(403).send({error: 'No auth token provided.'});
  }
});


// Routes which can accessed only by authorized users 
// /api/v1/confidential/...
confidential.use('/paintings/add', require('./paintings/add'));

module.exports = confidential;
