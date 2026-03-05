const Article = require("../models/articleModel");

// CREATE a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, category, publishedDate, writer } = req.body;
    const newArticle = new Article({
      title,
      content,
      category,
      publishedDate,
      writer,
    });
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating article", error });
  }
};

// GET all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    if (articles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No articles found" });
    }
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

// GET a single article by ID
exports.getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }
        res.status(200).json({ success: true, data: article });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching article", error });
    }
};

// UPDATE an article by ID
exports.updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, publishedDate, writer } = req.body;  
        const updatedArticle = await Article.findByIdAndUpdate(
            id,
            { title, content, category, publishedDate, writer },
            { new: true }
        );
        if (!updatedArticle) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }
        res.status(200).json({ success: true, data: updatedArticle });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating article", error });
    }
};

// DELETE an article by ID
exports.deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedArticle = await Article.findByIdAndDelete(id);
        if (!deletedArticle) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }
        res.status(200).json({ success: true, message: "Article deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting article", error });
    }
};

