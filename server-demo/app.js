const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const apartmentsRouter = require('./routes/apartments');
const usersRouter = require('./routes/users');
const citiesRouter = require('./routes/cities');



const app = express();

app.use(cors({origin: 'http://localhost:3001', credentials: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/apartments', apartmentsRouter);
app.use('/users', usersRouter);
app.use('/cities', citiesRouter);



module.exports = app;
