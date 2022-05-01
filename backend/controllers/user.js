const User = require("../models/auth");

exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id);

        if(user) {
            req.profile = user;
            next();
        } else {
            res.status(404).json({
                error: "User not found"
            })
        }
    } catch (error) {
        res.status(400).json({
            error: "User by id error"
        })
    }
}

exports.read = (req, res) => {
    if(req.profile) {
        req.profile.password = undefined;
        res.status(200).json({
            user: req.profile
        })
    } else {
        res.status(404).json({
            error: "User not found"
        })
    }
}

exports.update = async(req, res) => {
    if(req.profile) {
        const updateUser = await User.findByIdAndUpdate(req.profile.id, {$set: req.body}, {new: true});
        req.profile.password = undefined;
        res.status(200).json({
            message: "User updated successfully"
        })
    }
}