// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create SavedArticle schema
var SavedArticleSchema = new Schema({
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

// Create the SavedArticle model with the SavedArticleSchema
var SavedArticle = mongoose.model("SavedArticle", SavedArticleSchema);

// Export the model
module.exports = SavedArticle;
