const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({ msg: 'Not authorized!'});
    };

    //verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.client = decoded.client;
        next();
    } catch(err){
        res.status(401).json({msg: "Invalid token!"}); 
    }
}