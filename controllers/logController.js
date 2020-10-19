let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let log = require('../models/logModel')(sequelize, require('sequelize'));

router.post('/', function(req, res){
    let { description, definition, result } = req.body.log;
    log.create({
        description: description,
        definition: definition,
        result: result,
        owner_id: req.user.id
    }).then( 
        function success(log){
            res.json(log);
        }, 
        function error(err){
            res.status(500).json({ error: err.message });
        }
    );
});

router.get('/:id?', function(req, res){ //get all A USERS logs, get MY logs if no id sent in
    let userid = (typeof(req.params.id) == "undefined") ? req.user.id : req.params.id;

    log
        .findAll({ where: { owner_id: userid } })
        .then( 
            function Success(d){
                res.json(d);
            }, 
            function Error(err){
                res.status(500).json({ error: err.message });
            }
        );
});

router.put('/:id', function(req, res){ //update a log with a specific id
    let { description, definition, result } = req.body.log;

    log
        .update({ description: description, definition: definition, result: result},{ where: { id: req.params.id, owner_id: req.user.id }, returning: true })
        .then( 
            function Success(d){
                if(d[0]){ res.status(200).json( { result: "Update Successfull!" } ); }
                else{ res.status(500).json( { error: "Either there was no log with that id OR you are not the owner of it." } ); }
            }, 
            function Error(err){
                res.status(500).json({ error: err.message });
            }
        );
});

router.delete('/:id', function(req, res){ //delete a log with a specific id
    log
        .destroy({ where: { id: req.params.id, owner_id: req.user.id } })
        .then( 
            function Success(d){
                if(d){ res.status(200).json({ result: "You removed a log!" }); }
                else{ res.status(500).json( { error: "Either there was no log with that id OR you are not the owner of it." } ); }
            }, 
            function Error(err){
                res.status(500).json({ error: err.message });
            }
        );
});

module.exports = router;