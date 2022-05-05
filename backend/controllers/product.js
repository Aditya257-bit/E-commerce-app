const Product = require("../models/product");


exports.productById = async (req, res, next, id) => {
    const product = await Product.findById(id).populate('category');
    if(product) {
        req.product = product;
        next();
    } else {
        res.status(404).json({
            error: "Product not found"
        })
    }
}

exports.read = (req, res) => {
    req.product.photo = undefined;
    if(req.product) {
        res.status(200).send(req.product);
    }    
}


exports.create = (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.body.values;

        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = new Product({name, description, price, category, quantity});

        const saveProduct = product.save();
        res.status(200).json({
            message:"Product created successfully"
        })
    } catch (error) {
        res.status(400).json({
            message:"Product create error"
        })
    }
}

exports.update = async (req, res) => {
    const product = req.product;

    if(product) {
        const updateProduct = await Product.findByIdAndUpdate(product._id, {$set:req.body.values}, {new: true});
        res.status(200).json({
            message:"Product updated successfully"
        })
    }
};

exports.remove = async (req, res) => {
    const product = req.product;
    
    if(product){
        const deleteProduct = await Product.findByIdAndDelete(product._id);
        res.status(200).json({
            message: "Product deleted successfully"
        })
    } else {
        res.status(404).json({
            error: "Product not found"
        })
    }
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.order : '_id';
    let limit = req.body.limit ? req.body.limit : 10;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    let data = req.body.newFilters;

    for(let key in data) {
        if(data[key].length > 0) {
            if(key == 'price') {
                findArgs[key] = {
                    $gte: data[key][0],
                    $lte: data[key][1]
                };
            } else {
                findArgs[key] = data[key]
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
}

exports.list = async (req, res) => {
    // const limit = req.query.limit ? req.query.limit : 6;
    const page_size = 9;
    const page = parseInt(req.query.page || '0');
    const total = await Product.countDocuments();

    const products = await Product.find()
                                    .select("-photo")
                                    .populate("category")
                                    .limit(page_size)
                                    .skip(page_size*page);

    if(products) {
        res.status(200).json({
            totalPages: Math.ceil(total / page_size),
            products
        });
    } else {
        res.status(404).json({
            error: "Product not found"
        })
    }
}


exports.listCategory = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err) {
            res.status(404).json({
                error: "Categories not found"
            })
        }
        res.status(200).send(categories);
    })
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        // console.log(req.product.photo);
        return res.send(req.product.photo.data);
    }
    next();
}
