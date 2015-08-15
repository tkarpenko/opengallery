var express = require('express');

// include Router middleware 
// to create modular mountable route handlers
// for /api/v1/paintings/preview
var gallery = express.Router();

// We will use constants from config.js
var config = require('../../helpers/config');


// Neo4j DB Conection
var neo4j = require('node-neo4j');
var db = new neo4j(config.database);



/**
  ===========================================
  Routes to /api/v1/paintings/preview
  ===========================================
*/
gallery.route('/')

  // GET Request
  // This request is send with each Gallery template compiling
  .get(function (req, res) {

    // Make DB query to find info about 
    // Paintings and Painting Tools
    db.cypherQuery(
      'MATCH (painting:Art), (tool:PaintingTool)          \
      WHERE (painting)-[:PAINTEDIN]-(tool)                \
      RETURN DISTINCT (painting), tool.value, tool.name   \
      ORDER BY painting.pId',
      {},

      function (err, result) {

        if (err) {
          return res.status(500).send({error: 'Database error: ' + err});
        }
        
        // If there is no Painting in DB then send response with ID = 0
        if( result.data[0] === undefined) {
          return res.status(200).send([{'pId': 0}]);
        }


        var paintingPreview   = {},
            gallery           = [];

        for (var i = 0; i < result.data.length; i++) {
          paintingPreview           = result.data[i][0];
          paintingPreview.toolValue = result.data[i][1];
          paintingPreview.toolName  = result.data[i][2];
          paintingPreview.fileName  = config.paintingsUrl + paintingPreview.fileName;
          gallery[i]                = paintingPreview;
          paintingPreview           = {};
        }
        
        // Send response to client as array of objects:
        /* 
          [
            {
              author:     "Tania Karpenko", 
              description: "Horses on meadow in summer",
              fileName:    "/paintings/6864a745e1b43b00181d6f5ac2536ee7.jpg",
              title:       "Meadow",
              pId:         1,
              toolValue:   "oils",
              toolName:    "Oils"
            },                        
            {
              ...
            },
            ...                       
          ]
        */
        res.status(200).send(gallery);   
      }
    );
  });

module.exports = gallery;