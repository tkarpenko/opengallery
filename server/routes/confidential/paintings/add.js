var express = require('express');

// include Router middleware 
// to create modular mountable route handlers
// for /api/v1/confidential/paintings/add
var newPainting = express.Router();

// We will use constants from config.js
var config = require('../../../helpers/config');

// Include module to work with files i/o
var fs = require('fs-extra');

// Neo4j DB Conection
var neo4j = require('node-neo4j');
db = new neo4j(config.database);


/**
  ===========================================
  Routes to /api/v1/confidential/paintings/add
  ===========================================
*/

/**
  Route /api/v1/confidential/paintings/add
*/
newPainting.route('/')

  // GET Request
  // This request sends before saving data about new Painting.
  // At first the biggest ID number in DB will be found
  .get(function (req, res) {

    // find the biggest ID number
    db.cypherQuery(
      'MATCH (painting:Art) RETURN max(painting.pId)',
      {},

      function (err, result) {

        if (err) {
          return res.status(500).send({error: 'Database error on route confidential/paintings/add: '+err});
        }
     

        if( result.data[0] ) {
          res.status(200).send({'pId': +result.data[0]});

        // If there is no Painting in DB then send response that pID = 0
        } else {
          res.status(200).send({'pId': 0});
        }
      }
    );
  });


/**
  Route /api/v1/confidential/paintings/add/:pId
*/
newPainting.route('/:pId')

  // POST Request
  // This request sends for saving data about new Painting.
  .post(function(req, res) {

    // service object for keeping the FormData from request 
    var newPaintingData = {};

    // here is using busboy middleware for parsing the request
    // with FormData object

    // Continue parsing FormData object till newPaintingData object is not
    // filling with all form fields (exept [type="file"] field)  
    req.busboy.on('field', function(key, value) {

      // add next form field and its value
      newPaintingData[key] = value;

      // If all form fields are parsing through
      if ( isFull(newPaintingData) ) {

        // Make DB query for creating new record in DB
        // about new Painting
        db.cypherQuery(
          'CREATE (painting:Art {                   \
            pId: {pId},                             \
            title: {title},                         \
            author: {author},                       \
            description: {description},             \
            fileName: {fileName}                    \
          })                                        \
          WITH (painting)                           \
          MATCH (artist:Artist)                     \
          WHERE artist.alias = {addedBy}            \
            CREATE (painting)-[:ADDEDBY]->(artist)  \
          WITH (painting)                           \
          MATCH (tool:PaintingTool)                 \
          WHERE tool.value = {tool}                 \
            CREATE (painting)-[:PAINTEDIN]->(tool)  \
          RETURN painting',
          {
            pId:         +newPaintingData.pId,
            title:        newPaintingData.title,
            author:       newPaintingData.author,
            tool:         newPaintingData.tool,
            description:  newPaintingData.description,
            addedBy:      newPaintingData.addedBy,
            fileName:     newPaintingData.fileName
          }, 

          function (err, result) {
            if (err) {
              return res.status(500).send({error: 'Database error on route confidential/paintings/add/:pId: '+err});
            }
          }
        );
      }
    });


    // If FormData object's property is file field
    req.busboy.on('file', function(fieldname, file) {

      // If client side send not full required info then
      // send response with erro
      if ( !isFull(newPaintingData) ) {
        return res.status(403).send({error: 'Data about new painting is not full.'});
      }


      // Save image file on server
      var fstream = fs.createWriteStream('.' + config.paintingsStock + newPaintingData.fileName);
      file.pipe(fstream);

      // After saving send success response
      fstream.on('close', function () {             
        res.status(201).send({success: 'Painting data saved successfully.'});
      });
    });

    req.pipe(req.busboy);
  });


/**
  isFull() checks is all text fields are parsed
*/
function isFull(obj) {
  var count = 0,
      totalAmount = 7;  // amount of text field in Add Painting Form
  
  for (var key in obj) {
    count++;
  }
  return count == totalAmount;
}


module.exports = newPainting;