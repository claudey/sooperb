var express = require('express');
var fs = require('fs');

// var app = express.createServer(express.logger());
var app = express();

app.configure(function() {
	app.use(express.static(path.join(__dirname, 'public')));
	app.user(express.bodyParser());
	app.use(express.logger("short"));
});

app.get('/', function(request, response) {
  var data = fs.readFileSync('index.html').toString()
  response.send(data);
  
});

var port = process.env.PORT || 1000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
