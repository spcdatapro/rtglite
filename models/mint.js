'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MintSchema = Schema({
    access_token: String,
    token_type: String,
    expires_in: Number,
    refresh_token: String,
    'as:client_id': String,
    userName: String,
    issued: String,
    expires: String
});

module.exports = mongoose.model('mint', MintSchema, 'mint');