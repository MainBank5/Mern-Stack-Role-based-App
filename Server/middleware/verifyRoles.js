

const verifyRoles = (...allowedRoles) => {
    return(req, res, next) => {
        if(!req?.roles) return res.status(401).json({message:'Unauthorized!!'});
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);

        const permission = req.roles.map(role => rolesArray.includes(role).find(val => val === true))
        if(!permission) return res.status(401).json({message:'Unauthorized!'});
        next()
    }
}

module.exports = verifyRoles;