const jwt = require ('jsonwebtoken');

const verifyAccess = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader); //bearer token
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (error, decode) => {
            if (error) return res.sendStatus(403); //invalid token - forbidden
            req.user = decode.username //decode.username helps literally decode the username. onc its decode the re.user caries it forward to the next middleware
            req.roles = decode.roles //pass it over to the next middlware. remember roles was an array of values //you can choose to not include the extra layer userInfo. and access your payload directly
            next()
        }
    )
}

module.exports = verifyAccess;  
