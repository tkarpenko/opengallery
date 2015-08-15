var express = require('express');

// include Router middleware 
// to create modular mountable route handlers
// for /api/v1/auth/login
var login = express.Router();

// We will use constants from config.js
var config = require('../../helpers/config');

// Include module for JSON Web Token authentication 
var jwt = require('jsonwebtoken');

// Neo4j DB Conection
var neo4j = require('node-neo4j');
db = new neo4j(config.database);


/**
  ===========================================
  Routes to /api/v1/auth/login
  ===========================================
*/

login.route('/')
  .get(function(req, res) {
    console.log('here');
    res.render('/auth');
  });
/**
  Route /api/v1/auth/login/:alias
*/
login.route('/:alias')
  
  // GET Request
  // This request is send by client when artist is trying to loggin.
  // Make DB query to find artist with appropriate alias
  .get(function(req,res) {

    // Make DB query to find info about artist with current alias.
    db.cypherQuery(
      'MATCH (artist:Artist)               \
      WHERE artist.alias = {alias}         \
      RETURN count(artist), artist.pass',
      {
        alias: req.params.alias
      }, 

      // After DB query...
      function (err, result) {
        if (err) {
          return res.status(500).send({error: 'Database error: '+err});
        }

        // If asked artist is registered (his/her info is in database)
        if (result.data[0] !== undefined) {

          // Generate session token and send it with response
          // (This session token will store on the client side)
          var token = jwt.sign({pass: result.data[0][1]}, config.secretToken, {
            expiresInMinutes: 60*5
          });

          // Send response to client with 
          // 1) register flag
          // 2) artist password (password will be decrypted 
          //     and compared with password from LoginForm on client side)
          // 3) session token
          res.status(200).send({
            'registered': true,
            'pass': result.data[0][1], 
            'token': token
          });


        // else send response that such artist is not registered
        } else {
          res.status(200).send({'registered': false});
        }
      }
    );
  });

module.exports = login;