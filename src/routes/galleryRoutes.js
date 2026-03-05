const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");

// CREATE a new gallery record
router.post("/galleries", galleryController.createGallery);

// GET all gallery records
router.get("/galleries", galleryController.getAllGalleries);

// GET a single gallery record by ID
router.get("/galleries/:id", galleryController.getGalleryById);

// UPDATE a gallery record by ID
router.put("/galleries/:id", galleryController.updateGallery);

// DELETE a gallery record by ID
router.delete("/galleries/:id", galleryController.deleteGallery);