import express from 'express';
import listEnds from 'express-list-endpoints';
import { Key } from '../model/keys';
import { getMetadata } from './getMetadata.js';
import { getIamKey } from './getIamKey.js';

const app = express();

function generateResponse(key: Key) {
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
  try {
    const metadata = await getMetadata();

    if (!metadata || !metadata.alksAccount || !metadata.alksRole) {
      console.error('No metadata found or metadata is incomplete');
      resp.status(404).json({
        Code: 'Error',
        Message:
          'No ALKS credentials configured. Please run "alks sessions open" first.',
      });
      return;
    }

    const key = await getIamKey(
      metadata.alksAccount,
      metadata.alksRole,
      false,
      false,
      metadata.isIam
    );
    resp.json(generateResponse(key));
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    resp.status(500).json({
      Code: 'Error',
      Message: 'Failed to retrieve credentials',
      Error: error instanceof Error ? error.message : String(error),
    });
  }
});

const server = app.listen(45000, '127.0.0.1', () => {
  console.log('Metadata server listening on port 45000');
});

server.on('error', (error: NodeJS.ErrnoException) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error('Port 45000 is already in use');
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
