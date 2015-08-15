var express = require('express');

// include Router middleware 
// to create modular mountable route handlers
// for /api/v1/paintingtools
var categories = express.Router();

// We will use constants from config.js
var config = require('../../helpers/config');

// Neo4j DB Conection
var neo4j = require('node-neo4j');
var db = new neo4j(config.database);


/**
  ===========================================
  Routes to /api/v1/paintingtools
  ===========================================
*/
categories.route('/')

  // GET Request
  // This request is send with each Filter and 
  // AddPainting templates compiling
  .get(function (req, res) {

    // Make DB query to find info about all Painting Tools
    db.cypherQuery(
      'MATCH (tool:PaintingTool) \
      RETURN tool                \
      ORDER BY tool.ptId',
      {},
      function (err, result) {
        
        if (err) {
          return res.status(500).send({error: 'Database error: ' + err});
        }

        // Send response to client as array of objects:
        /* 
          [
            {value: 'oils', name: 'Oils', ptId: 1},
            {value: 'gouache', name: 'Gouache', ptId: 2},
            {value: 'pencils', name: 'Pencils', ptId: 3},
            { ... },
            ....
          ]
        */
        res.status(200).send(result.data);
      }
    );
  });

module.exports = categories;