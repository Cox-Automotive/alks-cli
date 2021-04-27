#!/usr/bin/env node
'use strict';

var express   = require('express'),
    Developer = require('./developer.js'),
    Iam       = require('./iam.js'),
    Sessions  = require('./sessions.js'),
    listEnds  = require('express-list-endpoints');

var app = express();

function generateResponse(key) {
    return {
        Code: 'Success',
        LastUpdated: new Date().toISOString(),
        Type: 'AWS-HMAC',
        AccessKeyId: key.accessKey,
        SecretAccessKey: key.secretKey,
        Token: key.sessionToken,
        Expiration: new Date(key.expires).toISOString(),
        ALKSIsIAM: key.isIAM,
        ALKSAccount: key.alksAccount,
        ALKSRole: key.alksRole
    };
}

app.get('/', (req, resp) => {
    resp.json(listEnds(app));
});

app.get('/latest/dynamic/instance-identity/document', (req, resp) => {
   resp.json({
       region: 'us-east-1'
   });
});

app.get(['/latest/meta-data/iam/security-credentials', '/latest/meta-data/iam/security-credentials/'], (req, resp) => {
    resp.end('alks');
});

app.get('/latest/meta-data/iam/security-credentials/*', async (req, resp) => {
    const metadata = await Developer.getMetadata();
    if (metadata.isIAM) {
        const { key } = await Iam.getIAMKey({}, null, metadata.alksAccount, metadata.alksRole, false, false);
        resp.json(generateResponse(key));
    } else {
        const key = await Sessions.getSessionKey({}, null, metadata.alksAccount, metadata.alksRole, false, false, false); 
        resp.json(generateResponse(key));
    }
});

app.listen(45000, '127.0.0.1', () => {
    console.log('Metadata server listening on port 45000');
});