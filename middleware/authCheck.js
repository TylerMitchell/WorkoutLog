let jwt = require('jsonwebtoken');
let sequelize = require('../db');
let User = require('../models/userModel')( sequelize, require('sequelize') );

module.exports = function(req, res, next){
    if( req.method == 'OPTIONS' ){
        next();
    } else{
        let sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if( !sessionToken ) {
            return res.status(403).send({ auth: false, message: 'No token provided.' });
        }
        else{
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if(decoded){
                    User.findOne({ where: { id: decoded.id } }).then( (user) => {
                        req.user = user;
                        next();
                    }, () => {
                        res.status(401).send({error: "Not Authorized!"});
                    });
                } else {
                    res.status(400).send({error: "Not Authorized!"});
                }
            });
        }
    }
};