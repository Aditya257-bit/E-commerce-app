const User = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const jwt_signin_secret = process.env.JWT_SIGNIN_SECRET;

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({email});
        
        if(user) {
            res.status(404).json({
                error: "Email id taken"
            })
        } else {
            const userData = new User({name, email, password});
            const saveUser = userData.save();
            res.status(200).json({
                message: "User signup successful"
            })
        }

    } catch (error) {
        res.status(400).json({
            error: "Signup error"
        })
    }
}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if(email) {
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch) {
                const token = jwt.sign({_id: user._id}, jwt_signin_secret, {expiresIn: "7d"});

                const { _id, name, email, role } = user;

                res.status(200).json({
                    token,
                    message: "Signin successful",
                    user: { _id, name, email, role }
                })
            } else {
                res.status(400).json({
                    error: "Invalid credentials"
                })
            }

        } else {
            res.status(400).json({
                error: "User not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            error: "Signin error"
        })
    }
}


exports.requireSignin = expressJwt({
    secret: jwt_signin_secret,
    algorithms: ['HS256'],
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user) {
        res.status(403).json({
            error: "Access denied"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role == 0) {
        res.status(403).json({
            error: "Admin resource! Access denied"
        })
    }
    next();
}

