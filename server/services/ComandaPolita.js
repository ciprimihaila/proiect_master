var express = require ("express");
var router = express.Router();

var helpers = require("./../helpers");

var ObjectID = require('mongodb').ObjectID;

module.exports.getRouter = function(collections) {
    var cerereCollection = collections['cerere'];
    var userCollection = collections['users'];
    
    router.post('/cerere', function (req, res) {
        console.log("post cerere");
        console.log(req.body);
        var params = {
            marca: 'array',
            model: 'array',
            tipauto: 'array',
            cnp: 'int',
            persfizica: 'string',
            power: 'int',
            serie: 'string',
            combustibil: 'string',
            anfabric: 'int',
            date: 'string',
            username: 'string',
            durata: 'array',
            address: 'string'
        };
        
        if (!req.body.persfizica && !req.body.persjuritica) {
            helpers.sendErrorResponse(res, "Campurile persjuritica sau persfizica nu exista");
            return;
        }
        
        var tipPersoana = null;
        if (req.body.persfizica) {
            tipPersoana = 'fizica';
        }
        else {
            tipPersoana = 'juritica';
        }
        
        var message;
        if ( (message = helpers.validateParams(params, req.body)) != null ) {
            helpers.sendErrorResponse(res, message);
            return;
        }
        
        userCollection.findOne({username: req.body.username}, function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err, '/register');
                return;
            }
            userCollection.updateOne(
                {username: req.body.username},
                {'$set': {address: req.body.address, cnp: req.body.cnp, tipPersoana: tipPersoana}},
                function (err, response) {
                    if (err) {
                        helpers.sendErrorResponse(res, err, '/resgister');
                        return;
                    }
                    req.body.cerereEmisa = false;
                    cerereCollection.insertOne(req.body, function(err, result) {
                        if (err) {
                            helpers.sendErrorResponse(res, err, '/resgister');
                            return;
                        }
                        helpers.sendOkResponse(res, "Cerere trimisa", '/cerere');
                    })
                }
            )
    
        })
        
    });
    
    return router;
}
