'use strict'

var moment = require('moment');
var request = require('request');
var axios = require('axios');
var qs = require('qs');

var Mint = require('../models/mint');
/*
//Datos de servidor de pruebas
var urlMintToken = "http://coltranecashlessapi-stg.azurewebsites.net/token";
var urlMintApi = "http://coltranecashlessapi-stg.azurewebsites.net/api/orden?";
var mintClientId = "spctest", mintClientSecret = "TffRsTvD4QxdsTy6WoUTh+86X46Zl3McKh78tMtP3aY=";
var mintUsr = "adminchicha1", mintPwd = "adminchicha1";
*/

var urlMintToken = "http://api.pos.verynicetech.com/token";
var urlMintApi = "http://api.pos.verynicetech.com/api/orden?";
var mintClientId = "webApp", mintClientSecret = "yuhb982";
var mintUsr = "adminjakepizza", mintPwd = "yuhb982";

async function updateMintToken(mintData = null) {
    if(!mintData){
        //Halar la configuración existente
        mintData = await Mint.find({}).then((m) => { return m[0]; });
    }
    // console.log('M1NT Data: ', mintData);
    var hoy = moment(), expira = moment(new Date(mintData.expires));
    // console.log('HOY: ', hoy.format('DD/MM/YYYY HH:MM:SS.SSS'));
    //console.log('.expires', mintData['.expires']);
    // console.log('EXPIRA: ', expira.format('DD/MM/YYYY HH:MM:SS.SSS'));
    if (hoy.isBefore(expira)) {
        console.log('Usando M1NT token existente...');
        return mintData;
    } else {
        console.log('Refrescando M1NT token...');
        /*var data = {
            grant_type: 'refresh_token',
            refresh_token: mintData.refresh_token,
            client_id: mintClientId
        };*/      
        var data = {
            grant_type: 'password',
            username: mintUsr,
            password: mintPwd,
            client_id: mintClientId
        }
        var newMintData = await axios.post(urlMintToken, qs.stringify(data)).then(function(response){ return response.data; }).catch(function(err) { return null; });
        if (newMintData) {
            var mint = {}, cuerpo = newMintData;
            mint.access_token = cuerpo.access_token;
            mint.token_type = cuerpo.token_type;
            mint.expires_in = cuerpo.expires_in;
            mint.refresh_token = cuerpo.refresh_token;
            mint['as:client_id'] = cuerpo['as:client_id'];
            mint.userName = cuerpo.userName;
            mint.issued = cuerpo['.issued'];
            mint.expires = cuerpo['.expires'];
            //return Mint.findByIdAndUpdate(mintData._id, newMintData, { new: true }).exec().then((mintUpd) => { return mintUpd; });
            return Mint.findByIdAndUpdate(mintData._id, mint, { new: true }).exec().then((mintUpd) => { return mintUpd; });
        } else {
            return null;
        }        
    }
}

function getMintToken(req, res) {
    Mint.find({}, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error al buscar la configuración de M1NT. Error: ' + err });
        } else {
            if (!lista || lista.length === 0) {
                // Crear el token por primera vez
                var frmData = {
                    grant_type: 'password',
                    username: mintUsr,
                    password: mintPwd,
                    client_id: mintClientId
                }
                request({
                    url: urlMintToken,
                    method: 'POST',
                    form: frmData
                }, function(errToken, httpResponse, body){
                    if (errToken) {
                        res.status(500).send({ mensaje: 'Error al solicitar el token en M1NT. Error: ' + errToken });
                    }

                    var mint = new Mint(), cuerpo = JSON.parse(body);
                    mint.access_token = cuerpo.access_token;
                    mint.token_type = cuerpo.token_type;
                    mint.expires_in = cuerpo.expires_in;
                    mint.refresh_token = cuerpo.refresh_token;
                    mint['as:client_id'] = cuerpo['as:client_id'];
                    mint.userName = cuerpo.userName;
                    mint.issued = cuerpo['.issued'];
                    mint.expires = cuerpo['.expires'];

                    mint.save().then((mintCreated) => {
                        res.status(200).send({ mensaje: 'Configuración M1NT creada.', entidad: mintCreated, cuerpo: cuerpo });
                    });

                });

            } else {
                var mintInfo = updateMintToken(lista[0]);
                res.status(200).send({ mensaje: 'Configuración M1NT.', entidad: mintInfo });
            }
        }
    });
}

async function getMintOrders(req, res) {
    var mintConf = await updateMintToken();
    var accessToken = mintConf.access_token;
    request({
        url: urlMintApi + 'desde=' + req.body.fdelstr + 'T00:00:00.000&hasta=' + req.body.falstr + 'T23:59:59.999',
        method: 'GET',
        auth: { bearer: accessToken }
    }, function (err, httpResponse, body) {
        if (err) {
            res.status(500).send({ mensaje: 'Error al solicitar las órdenes de M1NT. Error: ' + err });
        }
        res.status(200).send({ mensaje: 'Lista de órdenes de M1NT.', lista: JSON.parse(body) });
    });
}

module.exports = {
    getMintToken, getMintOrders
}