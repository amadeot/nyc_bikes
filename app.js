var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Configuration
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/bower_components'));
app.set('view engine', 'ejs')

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// DB setup
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoUrl = "mongodb://localhost:27017/myDb";
var db;
MongoClient.connect(mongoUrl, function(err, database){
  if (err) {
    console.log(err);
  }
  console.log("connected!");
  db = database;
  process.on('exit', db.close);
});

// custom middleware to log req body, params and query
app.use(function(req, res, next){
  console.log("body:", req.body, "params:", req.params, "query:", req.query);
  next();
});

app.get('/events', function(req, res) {
  res.render('calendar');
});



app.listen(process.env.PORT || 3000);