const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const apartmentsRouter = require('./routes/apartments');
const soldApartmentsRouter = require('./routes/soldApartments');
const usersRouter = require('./routes/users');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/apartments', apartmentsRouter);
app.use('/apartments/sold', soldApartmentsRouter);
app.use('/users', usersRouter);


module.exports = app;
