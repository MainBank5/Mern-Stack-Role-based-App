const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const handleLogOut = asyncHandler( async (req, res) => {

    const cookie = res.cookies
    console.log("your cookie: ", cookie);

    if(!cookie?.jwt) return res.status(204);
    const refreshToken = cookie.jwt;

    const foundUser = await User.findOne({refreshToken}).lean().exec();
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly:true, sameSite:'None' });
        res.status(204)
    }
    foundUser.refreshToken = ''
    const result = await foundUser.save();
    console.log(result);
    res.clearCookie('jwt', {httpOnly:true, sameSite:'None' });
    res.sendStatus(204);
})

module.exports = {handleLogOut};