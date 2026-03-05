const Gallery = require("../models/galleryModel");

// CREATE a new gallery record
exports.createGallery = async (req, res) => {
    try {
        const { title, categories } = req.body;
        const newGallery = new Gallery({ title, categories });
        const savedGallery = await newGallery.save();
        res.status(201).json(savedGallery);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error creating gallery record", error });
    }
};

// GET all gallery records
exports.getAllGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find();
        if (galleries.length === 0) {
            return res.status(404).json({ success: false, message: "No gallery records found" });
        }
        res.status(200).json({ success: true, data: galleries });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching gallery records", error });
    }
};

// GET a single gallery record by ID
exports.getGalleryById = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findById(id);
        if (!gallery) {
            return res.status(404).json({ success: false, message: "Gallery record not found" });
        }
        res.status(200).json({ success: true, data: gallery });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching gallery record", error });
    }
};

// UPDATE a gallery record by ID
exports.updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, categories } = req.body;
        const updatedGallery = await Gallery.findByIdAndUpdate(
            id,
            { title, categories },
            { new: true }
        );
        if (!updatedGallery) {
            return res.status(404).json({ success: false, message: "Gallery record not found" });
        }
        res.status(200).json({ success: true, data: updatedGallery });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating gallery record", error });
    }
};

// DELETE a gallery record by ID
exports.deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGallery = await Gallery.findByIdAndDelete(id);
        if (!deletedGallery) {
            return res.status(404).json({ success: false, message: "Gallery record not found" });
        }
        res.status(200).json({ success: true, message: "Gallery record deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting gallery record", error });
    }
};