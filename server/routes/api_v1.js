var express = require('express');

// include Router middleware 
// to create modular mountable route handlers
// for /api/v1/
var api = express.Router();


/**
  ===========================================
  Routes to /api/v1
  ===========================================
*/
api.use('/auth/registration', require('./auth/registration'));
api.use('/auth/login', require('./auth/login'));

api.use('/paintings/preview', require('./paintings/preview'));
api.use('/paintings/show', require('./paintings/show'));

api.use('/paintingtools', require('./painting-tools/tools'));

api.use('/confidential', require('./confidential/confidential'));

module.exports = api;
