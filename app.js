
/**
 * Module dependencies.
 */

var express = require('express'),
	stylus = require('stylus'),
	db = require('./model/db'),
	fs = require('fs'),
	path = require('path');

// Create app
var app = express();


app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(stylus.middleware({
		src: __dirname + '/views',
		dest: __dirname + '/public'
	}));
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler({
		showStack: true,
		dumpExceptions: true
	}));
});

// Load Routes
var routesDir = 'routes',
    routeFiles = fs.readdirSync(routesDir);

routeFiles.forEach(function (file) {
    var filePath = path.resolve('./', routesDir, file),
        route = require(filePath);
    route.init(app);
});

app.listen(app.get('port'), function () {
	console.log("Blog up @ " + app.get('port'));
});