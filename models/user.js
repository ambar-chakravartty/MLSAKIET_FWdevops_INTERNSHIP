const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String,required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    score: {type: Number, required: true},
    solved: {type: Array }
})

const User = mongoose.model('User',userSchema);

module.exports = User;