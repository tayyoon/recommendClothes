const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userProfile: {
        type: String,
    },
    //gender 값을 어떤형식으로 받아오는지 물어보기
    gender: {
        type: String,
        required: true,
    },
});


module.exports = mongoose.model('User', UserSchema);
