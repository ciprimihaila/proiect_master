var express = require ("express");
var router = express.Router();

var helpers = require("./../lib/helpers");

var ObjectID = require('mongodb').ObjectID;

module.exports.getRouter = function(collections) {
    var cerereCollection = collections.cerere;
    var userCollection = collections.users;
    
    
    router.post('/emitereCerere', function (req, res) {
        console.log("post emitereCerere");
        console.log(req.body);
        var params = {
            id: 'string'  
        };
        cerereCollection.updateOne(
            {_id: new ObjectID(req.body.id)},
            {'$set': {'cerereEmisa': true}},
            function (err, result) {
                if (err) {
                    helpers.sendErrorResponse(res, err);
                    return;
                }
                helpers.sendOkResponse(res, "Cerere emisa");
            }
        );
    });
    
    
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
        if ( (message = helpers.validateParams(params, req.body)) !== null ) {
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
                    });
                }
            );
    
        });
        
    });
    
    router.get('/cereri', function (req, res) {
        console.log("get cerere");
        
        var cursorCerere = cerereCollection.find({cerereEmisa: false});
        
        var cerereArray = [];
        cursorCerere.each(function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err, '/login');
                return;
            }
            if (doc === null) {
                helpers.sendOkResponse(res, cerereArray);
                return;    
            }
            cerereArray.push(doc);
        });
    });
    
    return router;
};
