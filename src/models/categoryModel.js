const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Article", "Gallery"], required: true },
},
{ timestamps: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

