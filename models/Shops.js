//Schema for shops for database

const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    lng: {
        type: String,
        required: true
    },
    postcodes: {
        type: [String],
        required: true

    }
});

const Shops = mongoose.model('Shops', ShopSchema);

module.exports = Shops;