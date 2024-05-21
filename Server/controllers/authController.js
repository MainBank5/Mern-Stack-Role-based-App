const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const handleLogin = asyncHandler( async (req, res,) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ "message": "Username and password required!" });
    }
     
    //find the user with the username
    const foundUser = await User.findOne({username}).lean().exec();
    
    if(!foundUser) {
        return res.status(400).json({ "message": "Invalid username or password!" });
    }
    //based on the password verify 
    const match = bcrypt.compareSync(password, foundUser.passowrd);

    if(match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        //create a token
        const accessToken = jwt.sign(
        {
            "userInfo":{
                "username": foundUser.username,
                "roles": roles
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '40m' }
       ); 

      const refreshToken = jwt.sign(
        {"username":foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
       );

       foundUser.refreshToken =refreshToken
       const result = await foundUser.save();
       console.log(result);

       res.cookie('jwt', refreshToken, {httpOnly:true, maxAge:24 * 60 * 60 * 1000});
       res.json({accessToken});
    } else {
        res.status(400).json({ "message": "Invalid username or password!" });
    }

})

module.exports = {handleLogin}