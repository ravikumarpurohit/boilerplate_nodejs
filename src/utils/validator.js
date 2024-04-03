const { check } = require("express-validator");

const checkValidation = [
    check('email', 'Email length should be 3 to 40 characters')
        .optional({ checkFalsy: true }) // Make email optional
        .isEmail().isLength({ min: 3, max: 40 }),
    check('mobile', 'Mobile number should contain 10 digits').optional({ checkFalsy: true })
        .isLength({ min: 10, max: 11 }),
    check('gender', 'Gender must be entered').optional({ checkFalsy: true })
        .isIn(["Male", "Female", "Other"]),
];

module.exports = checkValidation;