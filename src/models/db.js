const mongoose = require('mongoose');
const config = require('../config');
var debug = require('debug')('lemon-server:db');

if (!config.mongoUri) {
  console.error('MongoDB connection string missing!');
  process.exit(1);
}
mongoose.connect(config.mongoUri);
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB error: ' + err.message);
  process.exit(1);
});

db.once('open', () => {
  console.log('MongoDB connection established');

  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, JSON.stringify(query), doc);
  });
});
