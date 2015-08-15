var express = require('express');

// include Router middleware 
// to create modular mountable route handlers
// for /api/v1/auth/registration
var registration = express.Router();

// We will use constants from config.js
var config = require('../../helpers/config');

// Include module for JSON Web Token authentication 
var jwt = require('jsonwebtoken');

// Neo4j DB Conection
var neo4j = require('node-neo4j');
db = new neo4j(config.database);


/**
  ===========================================
  Routes to /api/v1/auth/registration
  ===========================================
*/

/**
  Route /api/v1/auth/registration
*/
registration.route('/')
  
  // POST Request
  // This request is send by client when new artist is trying to register himself/herself.
  // Create new node in DB for new artist
  // and save info about new artist
  .post(function (req, res) {

    // Make DB query for saving new artist info
    // New artist info is stored in req.body object
    db.cypherQuery(
      'CREATE (artist:Artist { \
        alias: {alias},        \
        email: {email},        \
        pass: {pass}           \
      })                       \
      RETURN artist',
      {
        alias: req.body.alias,
        email: req.body.email,
        pass: req.body.pass
      },

      // After DB query...
      function (err, result) {
        if (err) {
          return res.status(500).send({error: 'Database error: '+err}); 
        }

        // Generate session token and send it with response
        // (This session token will store on the client side)
        var token = jwt.sign({pass: req.body.pass}, config.secretToken, {
          expiresInMinutes: 60*5
        });

        // Send response to client with artist alias and session token
        res.status(201).send({
          'alias': req.body.alias,
          'token': token
        });

      }
    );
  });


/**
  Route /api/v1/auth/registration/:alias
*/
registration.route('/:alias')
  
  // GET Request
  // This request is sended by client when checking the unicity of alias.
  // This request has alias as param in route (/:alias).
  .get(function(req,res) {

    // Make DB query to find info about artist with current alias.
    db.cypherQuery(
      'MATCH (artist:Artist)         \
      WHERE artist.alias = {alias}   \
      RETURN count(artist)',
      {
        alias: req.params.alias
      },

      // After DB query...
      function (err, result) {
        if (err) { 
          return res.status(500).send({error: 'Database error: '+err});
        }

        // Response is the results of DB query. 
        // !result.data[0] = !0 = true  (alias is unique)
        // !result.data[0] = !1 = false (alias is not unique)
        res.status(200).send({'unique': !result.data[0]});
      }
    );
  });

module.exports = registration;