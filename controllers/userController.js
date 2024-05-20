const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler( async (req, res) => {
    const users = await User.find().select('-password').lean();

    if(!users?.length) {
        return res.status(400).json({message:"No User found"})
    }
    res.json(users)
});

//@desc create new user
//@route POST '/users'
const createNewUser = asyncHandler( async (req, res) => {
    const {username, password, roles} = req.body;

    if(!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message:"Please add a username, password and roles"})
    }
    

    //check for duplicate users
    const duplicate = await User.findOne({username}).lean().exec();

    if(duplicate) {
        return res.status(409).json({message:"Duplicate username"})
    }
     
    //hash the passowrd
    const hashedpassword = bcrypt.hashSync(password, 10);

    //create and save the user to DB
    const userObject = {username, password:hashedpassword, roles};

    const user = await User.create(userObject);

    if(user) { //created
        res.status(201).json({message:`Account created for ${user.username}`});
    } else {
        res.status(400).json({message:"Invalid user data"})
    }
});

//@desc update user
//@route PATCh '/users'
const updateUser = asyncHandler( async (req, res) => {
    const {id, username, active, password, roles} = req.body;
    //confirm data 
    if(!id || !username || !Array.isArray(roles) || !roles.length ||
   typeof active !== 'boolean' ) {
    return res.status(400).json({message:"All fields are required!"})
   }
   const user = await User.findById(id).exec();

   if(!user) {
    return res.status(400).json({message:"No user found!"})
   }

   //check for duplicate users
   const duplicate = await User.findOne({username}).lean().exec();

    if(duplicate && duplicate?._id.toString() !== id) { //there's a duplicate but not the id duplicate you're looking for
        res.status(409).json({message:"Duplicate username Only"})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if(password) {
        user.password = bcrypt.hashSync(password, 10)
    }

    const updatedUser = await user.save()

    res.json({message:`${updatedUser.username} successfully updated!`})
});

//@desc delete user
//@route DELETE '/users'
const deleteUser = asyncHandler( async (req, res) => {
    const {id} = req.body;

    if(!id) return res.status(400).json({message:"User ID required"})
    //if the user has notes assigned dont delete the user 
    const note = await Note.findOne({user:id}).lean().exec()

    if(note) {return res.status(400).json({message: "User has notes assigned, cannot delete user"})}
    
    const user = await User.findById(id).exec();

    if(!user) {return res.status(400).json({message:"User not found"})}
    
    const result = await User.deleteOne({ _id:id });
    const reply = `Username ${result.username} with ID ${id} deleted!`

    res.json({reply})
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};