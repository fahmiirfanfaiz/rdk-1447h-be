const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// CREATE a new article
router.post('/articles', articleController.createArticle);

// GET all articles
router.get('/articles', articleController.getAllArticles);

// GET a single article by ID
router.get('/articles/:id', articleController.getArticleById);

// UPDATE an article by ID
router.put('/articles/:id', articleController.updateArticle);

// DELETE an article by ID
router.delete('/articles/:id', articleController.deleteArticle);

module.exports = router;
