var express = require('express');

// include Router middleware 
// to create modular mountable route handlers
// for /api/v1/paintings/show
var showPainting = express.Router();

// We will use constants from config.js
var config = require('../../helpers/config');

// Neo4j DB Conection
var neo4j = require('node-neo4j');
var db = new neo4j(config.database);



/**
  ===========================================
  Routes to /api/v1/paintings/show
  ===========================================
*/
showPainting.route('/:pId')

  // GET Request
  // This request is send from each Painting Show page
  .get(function (req, res) {

    // response object
    var showPaintingInfo = {};
    
    // If some Filter's Item was active when request was sending
    // then prepare conditions with desired Painting Tools
    var dbQueryToolsConditions = req.query.filteredTools ? 'AND tool.value IN {filteredTools}' : '';

    // Make DB query to find Paintings
    // that are painted in desired Painting Tools
    db.cypherQuery(
      'MATCH (painting:Art), (artist:Artist), (tool:PaintingTool)  \
      WHERE (painting)-[:ADDEDBY]-(artist)                         \
        AND (painting)-[:PAINTEDIN]-(tool)' 
        + dbQueryToolsConditions +
      'RETURN painting, artist.alias                               \
      ORDER BY painting.pId',
      {
        filteredTools: req.query.filteredTools
      },

      function(err, result) {

        if (err) {
          return res.status(500).send({error: 'Database error on route paintings/show/:pId '+err});
        }

        // If there is no Painting in DB that conform the conditions
        // then send response that nothing finded
        if (result.data[0] === undefined) {
          return res.status(200).send({finded: false});
        }



        var paintings = result.data;
        
        // Find position of current Painting (in URL .../:pId)
        // in the array from DB query.
        // This position help to find out 
        // what Painting is previous and qhat is next
        for (var i = 0, requestedID = -1; i < paintings.length; i++) {
          if (paintings[i][0].pId == +req.params.pId) {
            requestedID = i;
            break;
          }
        }

        // If there is current Painting (in URL .../:pId) in DB query result
        // then send response with full info of current Painting 
        if (~requestedID) {
          showPaintingInfo          = paintings[requestedID][0];
          showPaintingInfo.addedby  = paintings[requestedID][1];

          showPaintingInfo.fileName = config.paintingsUrl + showPaintingInfo.fileName;
          
          var prev = (requestedID > 0)                    ? paintings[requestedID-1][0].pId : '';
          var next = (requestedID < paintings.length - 1) ? paintings[requestedID+1][0].pId : '';
          
          showPaintingInfo.prevID = prev;
          showPaintingInfo.nextID = next;
          
          showPaintingInfo.finded = true;

          return res.status(200).send(showPaintingInfo);

        // If there is current Painting in DB query result
        // then send response that nothing finded
        } else {
          return res.status(200).send({finded: false});
        }
      }
    );
  });

module.exports = showPainting;