const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
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

module.exports = app;
