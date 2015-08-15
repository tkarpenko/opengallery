'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');   // middleware for parsing requests
var busboy = require('connect-busboy');    // middleware for parsing requests with FormData object

var app = express();

// Request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboy());

// Directoy with front-end part
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(cookieParser());

// Main route
app.use('/api/v1', require('./routes/api_v1'));

// Modules usefull in development
app.use(require('./helpers/logger'));
app.use(require('./helpers/errors'));

app.listen(3000);