let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let User = require('../models/userModel')(sequelize, require('sequelize'));
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

router.post('/register', function(req, res){
    User.create({
        username: req.body.user.username,
        passwordhash: bcrypt.hashSync(req.body.user.password, 10)
    }).then( 
        function success(user){
            let token = jwt.sign( { id: user.id }, process.env.JWT_SECRET, { expiresIn: 60*60*24 } );

            res.json({
                user: user,
                message: 'created',
                sessionToken: token
            });
        }, 
        function error(err){
            res.send(500, err.message)
        }
    );
});

router.post('/login', (req, res) => {
    User.findOne( { where: { username: req.body.user.username } } ).then( 
        function success(user){
            if(user){ 
                bcrypt.compare( req.body.user.password, user.passwordhash, (err, matches) => {
                    console.log("The value matches: ", matches);
                    if( matches ){ 
                        let token = jwt.sign( { id: user.id }, process.env.JWT_SECRET, { expiresIn: 60*60*24 } );
                        res.json({ user: user, message: "successfully authenticated", sessionToken: token} ); 
                    }
                    else{ res.status(500).send({ error: "Failed to Authenticate!" }); }
                });
                //res.json(user); 
            }
            else{ res.status(502).send({ error: "Failed to Authenticate!" }); }
        }, 
        function error(err){
            res.send(500, err.message);
        }
    )
})

module.exports = router;