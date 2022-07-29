const mongoose = require('mongoose');
const { User} = require('./schema.js')

const addNewUser = async (newUserName) => {
    try {
        const newUser = new User({ userName: newUserName });
        const newSavedUser = await newUser.save();
    } catch (e) {
        throw new Error('Did not save user');
    }
};

module.exports = {
    addNewUser
};