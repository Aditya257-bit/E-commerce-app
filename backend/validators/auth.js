const { check } = require("express-validator");

exports.userSignupValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage("User name required"),
    check('email')
        .isEmail()
        .withMessage("Invalid email id"),
    check('password')
        .isLength({min: 6})
        .withMessage("Password must be atleast 6 characters long")    
]

exports.userSigninValidator = [
    check("email")
        .isEmail()
        .withMessage("Invalid email id"),
    check("password")
        .isLength({min: 6})
        .withMessage("Password must be atleast 6 characters long")
]