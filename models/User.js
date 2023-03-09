const mongoose = require('mongoose');
const User = mongoose.model('User', {
    name: String,
    birthDate: Date,
    email: String,
    phoneNumber: String,
    cpf: String,
    password: String,
    active: Boolean,
    activationToken: String,
});


module.exports = User;