const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const handlerefreshToken = asyncHandler( async (req, res,) => {
    const cookies = req.cookies;
    if(!cookies) return res.status(401);

    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({refreshToken});

    if(!foundUser) return res.sendStatus(403);

    //evaluate the cookie jwt
    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        (error, decode) => {
            if(error || foundUser.username !== decode.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);

            const accessToken = jwt.sign(
                {"userInfo":{
                    "username":decode.username,
                    "roles":roles
                }},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'40m'}
            )
            res.json(accessToken, roles)
        }
    )

}) 

module.exports = {handlerefreshToken};