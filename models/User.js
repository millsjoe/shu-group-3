//Creating User schema for Database

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: True
    },
    email: {
        type: String,
        required: True
    },
    password: {
        type: String,
        required: True
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//Creating model from schema
const User = mongoose.model('User', UserSchema);

model.exports = User;