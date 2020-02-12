const path = require('path')
const ParcelBundler = require('parcel-bundler');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

module.exports.socketIO = io

const PORT = 8080

const file = path.resolve(__dirname, '../client/index.html'); // Pass an absolute path to the entrypoint here
const options = {}; // See options section of api docs, for the possibilities

app.use(express.static(path.resolve(__dirname, '../../client/dist')))

// Initialize a new bundler using a file and options
const bundler = new ParcelBundler(file, options);

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());

server.listen(PORT);
// app.listen(PORT);
