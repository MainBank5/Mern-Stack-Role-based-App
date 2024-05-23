const User = require ('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const handleLogin = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password) return res.status(400).json({ "message": "Username and password required!" });
    const foundUser = await User.findOne({username:user}).exec();
    if (!foundUser) return res.sendStatus(401); //unauthorized
    //evaluate user 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean)
        //create JWTs
        //access tokens expires in short term, refresh token is longterm
        const accessToken = jwt.sign(
            {
                "Userinfo": {
                    "username":foundUser.username,
                    "roles":roles,
               }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '40m' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        //save logged in users with their refreshtoken
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        const {password:pass, ...rest} = result;
        console.log(rest);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite:'None', maxAge: 24 * 60 * 60 * 1000 }); //testing with thunder client remove secure:true for refresh route
        res.json({roles, accessToken, rest });
    } else {
        res.sendStatus(401) //unauthorized
    }
}

module.exports = { handleLogin };