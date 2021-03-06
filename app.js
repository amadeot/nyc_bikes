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
// app.use(function(req, res, next){
//   console.log("body:", req.body, "params:", req.params, "query:", req.query);
//   next();
// });

app.get('/calendar', function(req, res) {
    res.render('calendar');
});

app.get('/events', function(req, res){
  db.collection('events').find({}).toArray(function(err, results){
    res.json(results)
  })
})

app.get('/events/:id', function(req, res){
  db.collection('events').findOne({_id: ObjectId(req.params.id)}, function(err, result){
    res.json(result)
  })
})

app.post('/events/:id/rsvps', function(req, res){
  var newRSVP = {
    name: req.body.rsvp.name,
    email: req.body.rsvp.email
  };
  var id = req.body.rsvp.eventId;

  db.collection('events').update(
    {_id: ObjectId(id)}, {$push: {rsvps: newRSVP}},
    function(err, result){
      res.end()
    })
})

app.post('/events/:id/comments', function(req, res){
  var newComment = {
    name: req.body.submittedComment.name,
    comment: req.body.submittedComment.comment
  };
  var id = req.body.submittedComment.eventId;
  console.log(newComment, id)
  db.collection('events').update(
    {_id: ObjectId(id)}, {$push: {comments: newComment}},
    function(err, result){
      res.end()
    }
  )

})

app.get('/', function(req, res){
  res.render('index')
})


app.listen(process.env.PORT || 3000);