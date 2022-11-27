const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    cnpj: {
        type: Number,
        required: true
    },
    cep: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    image: {
        type: String,
        required: false
    }
});

const UserModel = mongoose.model('Store', storeSchema);

module.exports = UserModel;