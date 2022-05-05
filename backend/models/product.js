const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: ObjectId,
        ref: "category",
        required: true
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;