const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const {v1: uuidv1} = require("uuid");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    about: {
        type: String,
        trim: true
    },
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true});


UserSchema.pre('save', async function(req, res, next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;