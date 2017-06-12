// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var request = require("request");
var cheerio = require("cheerio");
// Require Article models
var Article = require("./models/Article.js");
var SavedArticle = require("./models/SavedArticle.js");
var Note = require("./models/Note.js");
 
//mongoose.connect('mongolab-acute-60828');
mongoose.connect('mongodb://localhost/news');
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Initialize Express
var app = express();


//app setup
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));
// Set Handlebars as the default templating engine.
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials',
  helpers: {debug: function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
   
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }
  }
  }
}));
app.set("view engine", "hbs");




// Routes
// ======

app.get("/", function(req, res) {
  //get all articles
  Article.find({}, function(error, doc){
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      //  res.send(doc)
      res.render('index', {articles: doc});
      console.log(doc);
    }
  });
});

// Simple index route
app.get("/scrape", function(req, res) {
  var articles = [];

  request("http://time.com/section/newsfeed/", function(error, response, html){
    var $ = cheerio.load(html);

    $("._1QwSFyrQ").each(function(i, element){

      var result = {};
      var count = $("._1QwSFyrQ").length;
      
      result.category = $(this).find('.g92dzT7Q').text();
      result.title = $(this).find("._2br3xTV7").text();
      result.link = "http://time.com" + $(this).find("._2br3xTV7").attr("href");
      result.image = $(this).find(".b-lazy").attr("data-src");

      var article = new Article(result);

      //get all articles
      Article.findOne({'title': article.title}, function(error, doc){
        if (error) {
          res.send(error);
        }
        // 
        else if(doc == null){
            article.save();
            articles.push(article);
            console.log('article saved');
            if(i == (count - 1)){
              console.log("redirect");
              res.redirect("/");
            }
        } else {
            console.log('no new articles');
            res.redirect("/");
        }
      });
    }); 


  });
  
  
});

app.get("/articles", function(req, res) {

  //get all articles
  Article.find({}, function(error, doc){
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
        res.send(doc);
     // res.render('index', {articles: doc});
    }
  });

});

app.post("/saved-articles", function(req, res) {
  var article = new SavedArticle(req.body);
  //console.log(article);
  article.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise, send the new doc to the browser
    else {
      res.send(doc);
    }
  });
});

app.get("/saved-articles", function(req, res) {
  //get all articles
  SavedArticle.find({})
  .populate("notes")
  .exec(function(error, doc){
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      res.render('saved', {articles: doc});
    }
  });
});

app.post("/saved-articles/note/:index", function(req, res) {
  var note = new Note(req.body);
  var articleId = req.params.index;
  console.log(note);

  note.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // 
    else {
      SavedArticle.findOneAndUpdate({'_id': articleId}, {$push: {'notes': doc._id}}, {new:true}, function(error, doc) {
        if(error) {
          console.log(error);
        } else {
          res.redirect('/saved-articles');
        }
      });

      
    }
  });

});



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
