/** @module service/Polita */
var express = require ("express");
var router = express.Router();

var helpers = require("./../lib/helpers");

var ObjectID = require('mongodb').ObjectID;


/**
 * Function used when a brooker confirms a entry from "Cerere"
 * 
 * @param {string} id
 */ 
function emitereCerere(cerereCollection, req, res) {
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
}

/**
 * Add a new entry in the "Cerere" collection
 * 
 * @param {string} marca
 * @param {string} model
 * @param {int} tipauto
 * @param {string} cnp
 * @param {int} persfizica
 * @param {string} power
 * @param {string} serie
 * @param {int} combustibil
 * @param {string} anfabric
 * @param {string} date
 * @param {string} username
 * @param {date} durata
 * @param {string} address
 */ 
function addCerere(userCollection, cerereCollection, req, res) {
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
}

/**
 * Get all entries from "Cerere" collection
 */ 
function getCereri(cerereCollection, req, res) {
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
}

/**
  * Registers routes for Polite module
  * 
  * @param collection Database collections that can be accessed from module
  */ 
module.exports.getRouter = function(collections) {
    var cerereCollection = collections.cerere;
    var userCollection = collections.users;
    
    
    router.post('/emitereCerere', function (req, res) {
       emitereCerere(cerereCollection, req, res);
    });
    
    
    router.post('/cerere', function (req, res) {
       addCerere(userCollection, cerereCollection, req, res);
    });
    
    router.get('/cereri', function (req, res) {
        getCereri(cerereCollection, req, res);
    });
    
    return router;
};
