const mongoose = require('mongoose');

const exerciseLogSchema = new mongoose.Schema({
    description: { type: String, required: true},
    duration: Number,
    date: { type: Date, default: Date.now},
    _userId: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('ExerciseLog', exerciseLogSchema);