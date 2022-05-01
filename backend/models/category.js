const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxLength: 32
    }
}, {timestamps: true});

const CategoryModel = mongoose.model("category", CategorySchema);

module.exports = CategoryModel;