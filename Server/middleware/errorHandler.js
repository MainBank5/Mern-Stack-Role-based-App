
const handleError = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if(err.name === 'CastError' && err.kind === 'ObjectId') { //specific mongodb error
        statusCode = 404;
        message = 'Resource not found!'
    }

    res.status(statusCode).json({message:message, 
        stack:process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {handleError}