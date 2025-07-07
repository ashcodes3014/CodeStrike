const validator = require('validator');

function Valid(data) {
    const arr = ['firstName', 'emailID', 'password'];
    const isAllowed = arr.every((val) => Object.keys(data).includes(val));
    if (!isAllowed) {
        throw new Error("fields missing");
    }
    if (!validator.isEmail(data.emailID)) {
        throw new Error("Incorrect email");
    }
    if (!validator.isStrongPassword(data.password)) {
        throw new Error("weak password");
    }
    if (data.firstName.length < 3 || data.firstName.length > 20) {
        throw new Error("Invalid name should have 3-20 characters");
    }
}


module.exports=Valid;