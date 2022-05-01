const Category = require("../models/category");

exports.categoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id);
        if(category) {
            req.category = category;
            next();
        } else {
            res.status(404).json({
                error: "category not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            error: "Category by id error"
        })
    }
}

exports.read = (req, res) => {
    const category = req.category;
    if(category) {
        res.status(200).json({
            category
        })
    }
}

exports.create = async (req, res) => {
    try {

        const category = await Category.findOne({name: req.body.name});

        if(category) {
            res.status(400).json({
                error: "Category with this name already present"
            })
        } else {
            const newCategory = new Category(req.body);
            const saveCategory = newCategory.save();
            res.status(200).json({
                message:"Category created successfully",
                data: newCategory
            })
        }

    } catch (error) {
        res.status(400).json({
            error: "Create Category error"
        })
    }
}

exports.update = (req, res) => {
    const category = req.category;

    if(category){
        category.name = req.body.name;
        const saveCategory = category.save();
        res.status(200).json({
            message: "Category updated successfully"
        })
    } else {
        res.status(404).json({
            error: "Category not found"
        })
    }
}

exports.remove = async (req, res) => {
    const category = req.category;
    
    if(category){
        const deleteCategory = await Category.findByIdAndRemove(category._id);
        res.status(200).json({
            message: "Category deleted successfully"
        })
    } else {
        res.status(404).json({
            error: "Category not found"
        })
    }
}

exports.list = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            categories
        })
    } catch (error) {
        res.status(404).json({
            message: "Category not found"
        })
    }
}