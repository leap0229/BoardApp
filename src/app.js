const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(cookieParser());

// routerの設定
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

module.exports = app;