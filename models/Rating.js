//Creating Rating schema for Database

const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    overall: {
        type: Number,
        required: true
    },
    atmosphere: {
        type: Number,
        required: true
    },
    coffee: {
        type: Number,
        required: true
    },
    dairy_free: {
        type: Number,
        required: true
    },
    favourite_drink: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

//Creating model from schema
const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;