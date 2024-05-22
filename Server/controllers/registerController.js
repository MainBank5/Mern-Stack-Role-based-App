const User = require('../models/User');
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

const register = asyncHandler( async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    //check for existing user
    const duplicate = await User.findOne({username}).lean().exec();
    if(duplicate) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    //hash password and save the hashed password and username to the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    const userObject = {username, passowrd:hashedPassword}

    const user = await User.create(userObject)
    if(user) {
        res.status(201).json({ message: 'Account created successfully' })
    } else {
        res.status(400).json({ message: 'Invalid user data' })
    }
    
}) 

module.exports = {register }