'use strict'

const Setting = require('../models/settings');
const {google} = require('googleapis');
const plus = google.plus('v1');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
var request = require('request');



const oauth2Client = new google.auth.OAuth2(
    '1000628738472-edvf85u215ujef368nlii5845r45pgun.apps.googleusercontent.com',
    'cUwmzdRC2g34k9_0kpcOvOqO',
    'http://localhost:3789/'
    //'http://localhost:4200/'
);

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/cloudprint'
});

function googleurl(req, res) {
    return res.status(200).send({
        result: { googleURLToken: url }
    });
}

function googletoken(req, res) {

    Setting.find({}, (errSettings, configs) => {
        if (errSettings) {
            res.status(500).send({ mensaje: 'Error al tratar de obtener las configuraciones. Error: ' + errSettings });
        } else {
            if (!configs || configs.length === 0) {
                oauth2Client.getToken(req.body.code, function (err, tokens) {
                    if (err) {
                        res.status(500).send({ mensaje: 'Error al obtener el token. ' + err, code: req.body.code });
                    } else {
                        oauth2Client.credentials = tokens;
                        // console.log(oauth2Client);
                        // If refresh token exits save it
                        // because the refresh token it returned only 1 time! IMPORTANT
                        if (tokens.hasOwnProperty('refresh_token')) {

                            let setting = new Setting();
                            setting.refreshTokenGoogle = tokens.refresh_token;
                            setting.expirationTokenGoogle = tokens.expiry_date;
                            setting.tokenGoogle = tokens.access_token;

                            setting.save()
                                .then((settingCreated) => {
                                    return res.status(200).send({
                                        message: 'OK'
                                    });
                                });
                        } else {
                            return res.status(200).send({
                                message: 'El token ya debería estar guardado en la BD :-('
                            });
                        }
                    }
                });
            } else {
                return res.status(200).send({ message: 'El token ya existe en la base de datos...' });
            }
        }
    });    
}

async function getTokenGoogleUpdated(forceUpdate = false) {

    return await Setting.find({})
        .then(async setting => {
            const refreshTokenGoogle = setting[0].refreshTokenGoogle;
            const expirationTokenGoogle = setting[0].expirationTokenGoogle;
            const tokenGoogle = setting[0].tokenGoogle;

            const dateToday = new Date();
            // 1 minute forward to avoid exact time
            const dateTodayPlus1Minute = moment(dateToday).add(1, 'm').toDate();
            const dateExpiration = new Date(expirationTokenGoogle);

            // Case date expiration, get new token
            if (forceUpdate || (dateExpiration < dateTodayPlus1Minute)) {
                console.log('Updating access token.');
                oauth2Client.credentials['refresh_token'] = refreshTokenGoogle;
                return await oauth2Client.refreshAccessToken(async function (err, tokens) {
                    // Save new token and new expiration
                    setting[0].expirationTokenGoogle = tokens.expiry_date;
                    setting[0].tokenGoogle = tokens.access_token;

                    await setting[0].save();

                    return tokens.access_token;
                });

            } else {
                console.log('Using existing access token.');
                return tokenGoogle;
            }

        })
        .catch(err => {
            console.log(err);
        });

}

function updateToken(req, res){
    getTokenGoogleUpdated(true);
    return res.status(200).send({
        result: { mensaje: "Token actualizado..." }
    });    
}

function print(req, res) {
    var trackingNo = req.body.tracking;

    const rptApiUrl = 'http://localhost:5489/api/report';
    request.post({
        url: rptApiUrl,
        headers: { 'Content-Type': 'application/json' },
        json: true,
        encoding: 'binary',
        body: {
            "template": { "shortid": "BkLxkSBnz" },
            "data": { "tracking": trackingNo }
        }
    }, async function (err, httpResponse, body) {
        if (err) {
            res.status(500).send({ mensaje: 'Error en la llamada al reporte', error: err });
        }
        // console.log(body);
        // const tickeProperties = { 'version': '1.0' };        
        fs.writeFile('pdf/COM' + trackingNo + '.pdf', body, 'binary', async (errPdf) => {
            if (errPdf) {
                res.status(500).send({ mensaje: 'Error en la escritura del archivo PDF.', error: errPdf });
            }
            // res.status(200).send({ mensaje: 'Archivo guardado con éxito.' });            
            const copias = await Setting.find({}).then(setting => { return +setting[0].copias; }).catch(err => { return 1; });
            const printerid = await Setting.find({}).then(setting => { return setting[0].printerid; }).catch(err => { return 'c598b72f-14fa-a97a-cd9c-f6a220efe53e'; });
            const accessToken = await getTokenGoogleUpdated(false);
            const frmData = {
                printerid: printerid,
                title: 'COM' + trackingNo,
                ticket: '{"version": "1.0", "print": {"copies":{"copies": ' + copias + '}}}',
                contentType: 'application/pdf',
                content: fs.createReadStream('pdf/COM' + trackingNo +'.pdf')
            };
            request({
                url: 'https://www.google.com/cloudprint/submit',
                method: 'POST',                
                auth: { bearer: accessToken },
                formData: frmData
            }, function (err2, httpResponse2, body2) {
                if (err2) {
                    res.status(500).send({ mensaje: 'Error en el submit de la impresión', error: 'Upload failed: ' + err2 });
                }

                res.status(200).send({ response: body2, respuestaHttp: httpResponse2 });

            }, (reason, response, body) => {
                res.status(500).send({ mensaje: 'Error2 en el submit de la impresión', error: reason });
            });
        });
        
    });
}

module.exports = {
    googleurl, googletoken, updateToken, print
}