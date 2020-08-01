module.exports = {
  apps : [{
    "name": 'Murshid',
    "script": 'node',
    "args": 'dist/server',
    "autorestart": false,
    "watch": false,
    "listen_timeout" : 3000
  }]
};
