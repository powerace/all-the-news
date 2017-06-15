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
  //helper to debug handlebars
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

//root route sends database response to template
app.get("/", function(req, res) {
  //get all articles
  Article.find({}, function(error, doc){
    if (error) {
      res.send(error);
    } else {
      //pass articles object to handlebars
      res.render('index', {articles: doc});

    }
  });
});

// Let's scrape for articles
app.post("/scrape", function(req, res) {
  //create array to store articles
  var articles = [];

  //send request to mashable for articles
  request("http://time.com/section/newsfeed/", function(error, response, html){
    var $ = cheerio.load(html);

    //for each article, pull relevant info and store in object.
    $("._1QwSFyrQ").each(function(i, element){

      var result = {};
      var count = $("._1QwSFyrQ").length;
      
      result.category = $(this).find('.g92dzT7Q').text();
      result.title = $(this).find("._2br3xTV7").text();
      result.link = "http://time.com" + $(this).find("._2br3xTV7").attr("href");
      result.image = $(this).find(".b-lazy").attr("data-src");

      var article = new Article(result);

      //check the database to make sure an article with the same title doesn't already exist. 
      Article.findOne({'title': article.title}, function(error, doc){
        // if there's a database error send an error message
        if (error) {
          res.send(error);
        //if the article doesn't already exist, save it to the database and store it in the articles array
        } else if (doc == null){
            article.save();
            articles.push(article);
            console.log('article saved');
            //redirect to the root route after the last article checked and stored
            if(i == (count - 1)){
              console.log("redirect");
              res.redirect("/");
            }
        //if the requested article already exists, redirect after it's checked against the last database article
        } else {
            if(i == (count - 1)){
              console.log("no new articles");
              res.redirect("/");
            }
        }
      });
    }); 


  });
  
  
});

// route that displays json of all articles in Article database collection
app.get("/articles", function(req, res) {
  //get all articles
  Article.find({}, function(error, doc){
    if (error) {
      res.send(error);
    }
    //send the response to the browser
    else {
        res.send(doc);
    }
  });

});

//post to save article in separate database collection
app.post("/saved-articles", function(req, res) {
  var article = new SavedArticle(req.body);
  article.save(function(error, doc) {
    // send any errors to the browser
    if (error) {
      res.send(error);
    }
  });
});

//route to display all saved articles in the database
app.get("/saved-articles", function(req, res) {
  //get all articles
  SavedArticle.find({})
  .populate("notes")
  .exec(function(error, doc){
    if (error) {
      res.send(error);
    }
    // Or send the doc to the saved articles template
    else {
      res.render('saved', {articles: doc});
    }
  });
});

//post to save an article note
app.post("/saved-articles/note/:id", function(req, res) {
  var note = new Note(req.body);
  var articleId = req.params.id;
  //save note
  note.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    //find the populated notes array on the saved article the matches the route id and add the note object id to the array
    else {
      SavedArticle.findOneAndUpdate({'_id': articleId}, {$push: {'notes': doc._id}}, {new:true}, function(error, doc) {
        if(error) {
          console.log(error);
        //redirect to the saved-articles route to render all saved articles
        } else {
          res.redirect('/saved-articles');
        }
      });
      
    }
  });

});

//delete note 
app.get("/delete/note/:id", function(req, res) {
  var noteId = req.params.id;

  Note.find().remove({"_id": noteId}).exec(function(error, doc){
    if (error) {
      res.send(error);
    }
    // send doc back to the browser to update
    else {
      res.send(doc);
    }
  });

});

//delete article
app.get("/saved-articles/delete/:id", function(req, res) {
  var articleId = req.params.id;

  SavedArticle.find().remove({"_id": articleId}).exec(function(error, doc){
    if (error) {
      res.send(error);
    }
    // send doc back to the browser to update
    else {
      res.send(doc);
    }
  });

});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
