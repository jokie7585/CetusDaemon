var createError = require('http-errors');
import httpErr from 'http-errors'
import express from "express"
import CookieParser from 'cookie-parser'
import Logger from 'morgan'
import ph from 'path'

import {indexRouter} from './routes/index'
import {administratorRouter} from './routes/administrator'
// middelware
import {Initial, appendProperty} from './middleware/sheduler/cetusScheduler'
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', ph.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(Logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CookieParser());
app.use(express.static(ph.join(__dirname, 'public')));
app.use(appendProperty)

// init scheduler
Initial()

app.use('/', indexRouter.router);
app.use('/administrate', administratorRouter.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(httpErr(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
