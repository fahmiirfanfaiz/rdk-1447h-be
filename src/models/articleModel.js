const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    writer: { type: String, required: true },
  },
  { timestamps: true },
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
