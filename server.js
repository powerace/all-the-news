// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var request = require("request");
var cheerio = require("cheerio");
// Require Article models
var Article = require("./models/Article.js");
 
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



// Routes
// ======

// Simple index route
app.post("/scrape", function(req, res) {
  request("http://time.com/section/newsfeed/", function(error, response, html){
    var $ = cheerio.load(html);

    $("._1QwSFyrQ").each(function(i, element){

      var result = {};
      
      result.category = $(this).find('.g92dzT7Q').text();
      result.title = $(this).find("._2br3xTV7").text();
      result.link = $(this).find("._2br3xTV7").attr("href");
      result.image = $(this).find(".b-lazy").attr("data-src");

      var article = new Article(result);

      article.save(function(error, saved) {
          // If there's an error during this query
          if (error) {
            // Log the error
            console.log(error);
          }
          // Otherwise,
          else {
            // Log the saved data
            console.log(saved);
          }
      });
    });   
  });
});



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
