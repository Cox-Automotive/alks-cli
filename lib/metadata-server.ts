#!/usr/bin/env node
'use strict';

import express from 'express';
import { getMetadata } from './developer.js';
import { getIAMKey } from './iam.js';
import { getSessionKey } from './sessions.js';
import listEnds from 'express-list-endpoints';
import commander from 'commander';

let app = express();

const logger = 'metadata-server';

function generateResponse(key: any) {
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
    ALKSRole: key.alksRole,
  };
}

app.get('/', (_req, resp) => {
  resp.json(listEnds(app));
});

app.get('/latest/dynamic/instance-identity/document', (_req, resp) => {
  resp.json({
    region: 'us-east-1',
  });
});

app.get(
  [
    '/latest/meta-data/iam/security-credentials',
    '/latest/meta-data/iam/security-credentials/',
  ],
  (_req, resp) => {
    resp.end('alks');
  }
);

app.get('/latest/meta-data/iam/security-credentials/*', async (_req, resp) => {
  const metadata = await getMetadata();
  if (metadata.isIAM) {
    const { key } = await getIAMKey(
      {} as commander.Command,
      logger,
      metadata.alksAccount,
      metadata.alksRole,
      false,
      false
    );
    resp.json(generateResponse(key));
  } else {
    const key = await getSessionKey(
      {} as commander.Command,
      logger,
      metadata.alksAccount,
      metadata.alksRole,
      false,
      false,
      false
    );
    resp.json(generateResponse(key));
  }
});

app.listen(45000, '127.0.0.1', () => {
  console.log('Metadata server listening on port 45000');
});
