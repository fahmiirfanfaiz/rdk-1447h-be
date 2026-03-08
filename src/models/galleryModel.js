const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileExtension: { type: String, required: true },
    fileSize: { type: Number, required: true },
    filePath: { type: String, required: true },
  },
  { _id: false },
);

const gallerySchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: { type: [imageSchema], default: [] },
  },
  { timestamps: true },
);

const Gallery = mongoose.model("Gallery", gallerySchema);
module.exports = Gallery;
