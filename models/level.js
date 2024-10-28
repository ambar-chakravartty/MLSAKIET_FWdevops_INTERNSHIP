const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    name: {type: String, required: true},
    question: {type: String, required: true},
    flag: {type: String, required: true},
})

const Level = mongoose.model('Level',levelSchema);

module.exports = Level;