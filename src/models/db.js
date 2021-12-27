const mongoose = require('mongoose');
const config = require('../config');

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

db.once('open', () => console.log('MongoDB connection established'));
