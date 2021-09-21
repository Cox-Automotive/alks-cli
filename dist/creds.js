#!/usr/bin/env node
"use strict";
var net = require('net');
var client = net.createConnection(process.env.KEYCHAIN_SOCK);
client.on('connect', function () {
    client.write('alksuid\n');
});
client.on('data', function (data) {
    var password = data.toString('utf-8').trim();
    var output = { password: password };
    console.log(JSON.stringify(output));
    client.destroy();
    process.exit();
});
//# sourceMappingURL=creds.js.map