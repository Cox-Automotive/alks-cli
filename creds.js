#!/usr/bin/env node

const net = require('net');

const client = net.createConnection(process.env.KEYCHAIN_SOCK);

client.on('connect', () => {
  client.write('alksuid\n');
});

client.on('data', (data) => {
  const password = data.toString('utf-8').trim();
  const output = { password };
  console.log(JSON.stringify(output));
  client.destroy();
  process.exit();
});
