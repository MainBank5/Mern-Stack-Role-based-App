const User = require('../model/User');

const handleLogOut = async (req, res) => {
    //on client also delete access token 

    const cookies = req.cookies
    console.log("this are the cookies",req.cookies)
    if (!cookies?.jwt) return res.sendStatus(204); //no content  
    const refreshToken = cookies.jwt
    //is refresh token in DB
    const foundUser = await User.findOne({refreshToken}).exec();
    if (!foundUser) {
        //when you delete the cookie maintain the same options as the inital ones except for maxAge its not a must
        res.clearCookie('jwt', {httpOnly:true,sameSite:'None'});
        return res.sendStatus(204);
    }; 
    //delete token for founduser/update it to empty string
    foundUser.refreshToken = ''
    const result = await foundUser.save();
    console.log(result);
    res.clearCookie('jwt', {httpOnly:true, sameSite:'None' });
    res.sendStatus(204);
}

module.exports = {handleLogOut};