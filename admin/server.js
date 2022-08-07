var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
//var fs = require("fs");
global.setting = require('./app/config/setting');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var server = app.listen(setting.port, function () {});

app.use(express.static('public'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
	secret: '@#@$MYSIGN#@$#$',
	resave: false,
	saveUninitialized: true
}));

var router = require('./router/main')(app);