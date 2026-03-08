const Category = require("../models/categoryModel");
const Article = require("../models/articleModel");
const Gallery = require("../models/galleryModel");

// CREATE a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const newCategory = new Category({ name, type });
    const savedCategory = await newCategory.save();
    res.status(201).json({ success: true, data: savedCategory });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });
    }
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// GET a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

// UPDATE a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, type },
      { new: true, runValidators: true },
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// DELETE a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Guard: prevent deletion if the category is referenced by any article or gallery
    const [articleCount, galleryCount] = await Promise.all([
      Article.countDocuments({ category: id }),
      Gallery.countDocuments({ category: id }),
    ]);

    const blockers = [];
    if (articleCount > 0) blockers.push(`${articleCount} article(s)`);
    if (galleryCount > 0) blockers.push(`${galleryCount} gallery record(s)`);

    if (blockers.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Category cannot be deleted because it is assigned to ${blockers.join(" and ")}. Reassign or delete those records first.`,
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};
