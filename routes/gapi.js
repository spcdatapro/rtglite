var express = require('express');
var GApiController = require('../controllers/gapi');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Google API
api.get('/gapi/googleurl', GApiController.googleurl);
api.post('/gapi/googletoken', GApiController.googletoken);
api.get('/gapi/updgtoken', GApiController.updateToken);
api.post('/gapi/print', md_auth.ensureAuth, GApiController.print);

module.exports = api;