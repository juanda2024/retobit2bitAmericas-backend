var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
mu = require('./lib/utils/mongo.js');

var questionsRouter = require('./routes/questions');
var answersRouter = require('./routes/answers');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/questions', questionsRouter);
app.use("/answers", answersRouter);
app.use("/users", usersRouter);

module.exports = app;