var express = require('express');
var MintController = require('../controllers/mint');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Google API
api.get('/mint/token', MintController.getMintToken);
api.post('/mint/ordenes', md_auth.ensureAuth, MintController.getMintOrders);

module.exports = api;