'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingsClienteSchema = Schema({
    refreshTokenGoogle: String,
    expirationTokenGoogle: String,
    tokenGoogle: String,
    copias: Number,
    printerid: String
});

module.exports = mongoose.model('settings', SettingsClienteSchema, 'settings');