const path = require("path");
const fs = require("fs");
const Gallery = require("../models/galleryModel");
const Category = require("../models/categoryModel");

// CREATE a new gallery record
exports.createGallery = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Validate that the referenced category exists
    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found. Provide a valid categoryId.",
      });
    }

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        images.push({
          originalName: file.originalname,
          mimeType: file.mimetype,
          fileExtension: path.extname(file.originalname),
          fileSize: file.size,
          filePath: file.path,
        });
      }
    }

    const newGallery = new Gallery({ category: categoryId, images });
    const savedGallery = await newGallery.save();
    await savedGallery.populate("category", "name");
    res.status(201).json({ success: true, data: savedGallery });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating gallery record",
      error: error.message,
    });
  }
};

// GET all gallery records
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().populate("category", "name");
    if (galleries.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No gallery records found" });
    }
    res.status(200).json({ success: true, data: galleries });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching gallery records",
      error: error.message,
    });
  }
};

// GET a single gallery record by ID
exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id).populate("category", "name");
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery record not found" });
    }
    res.status(200).json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching gallery record",
      error: error.message,
    });
  }
};

// GET satu gambar dari gallery sebagai file — index berbasis 0
exports.getGalleryImage = async (req, res) => {
  try {
    const { id, index } = req.params;
    const imgIndex = parseInt(index, 10);
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery record not found" });
    }
    if (!gallery.images || gallery.images.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery has no images" });
    }
    if (isNaN(imgIndex) || imgIndex < 0 || imgIndex >= gallery.images.length) {
      return res.status(400).json({
        success: false,
        message: `Index tidak valid. Tersedia index 0 sampai ${gallery.images.length - 1}.`,
      });
    }
    const imageDoc = gallery.images[imgIndex];
    const absolutePath = path.resolve(imageDoc.filePath);
    if (!fs.existsSync(absolutePath)) {
      return res
        .status(404)
        .json({ success: false, message: "File tidak ditemukan di server" });
    }
    res.set("Content-Type", imageDoc.mimeType);
    res.set(
      "Content-Disposition",
      `inline; filename="${imageDoc.originalName}"`,
    );
    res.sendFile(absolutePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving gallery image",
      error: error.message,
    });
  }
};

// UPDATE a gallery record by ID
// Jika gambar baru dikirim → mengganti semua gambar lama (file lama dihapus dari disk).
// Jika tidak ada gambar baru → gambar lama tetap tersimpan.
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, categoryId } = req.body;

    // Validate category if a new one is being set
    if (categoryId !== undefined) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found. Provide a valid categoryId.",
        });
      }
    }

    const updateData = { title };
    if (categoryId !== undefined) updateData.category = categoryId;
    if (req.files && req.files.length > 0) {
      // Hapus file lama dari disk
      const oldGallery = await Gallery.findById(id);
      if (oldGallery && oldGallery.images) {
        for (const img of oldGallery.images) {
          const absPath = path.resolve(img.filePath);
          if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
        }
      }

      const newImages = [];
      for (const file of req.files) {
        newImages.push({
          originalName: file.originalname,
          mimeType: file.mimetype,
          fileExtension: path.extname(file.originalname),
          fileSize: file.size,
          filePath: file.path,
        });
      }
      updateData.images = newImages;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category", "name");
    if (!updatedGallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery record not found" });
    }
    res.status(200).json({ success: true, data: updatedGallery });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating gallery record",
      error: error.message,
    });
  }
};

// DELETE a gallery record by ID — hapus file dari disk juga
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery record not found" });
    }

    // Hapus file dari disk
    if (gallery.images) {
      for (const img of gallery.images) {
        const absPath = path.resolve(img.filePath);
        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      }
    }

    await Gallery.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Gallery record deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting gallery record",
      error: error.message,
    });
  }
};
