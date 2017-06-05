// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // category is a required string
  category: {
    type: String,
    required: true
  },
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // image is a required string
  image: {
    type: String,
    required: true
  },
  // This saves notes' ObjectId, ref refers to the Note model
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
