const express = require('express');
const path = require('path');
const logger = require('morgan');
require('../src/models/db');

const v1Router = require('./v1');
const v2Router = require('./v2');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', v1Router);
app.use('/v2', v2Router);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

module.exports = app;
