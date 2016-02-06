var express = require ("express");
var router = express.Router();

var helpers = require("./../lib/helpers");
var ObjectID = require('mongodb').ObjectID;

var globalDaunaCollection;

/**
  * Registers routes for Daune module
  * 
  * @param collection Database collections that can be accessed from module
  */ 
module.exports.getRouter = function(collections) {
    var cerereCollection = collections.cerere;
    var userCollection = collections.users;
    var daunaCollection = collections.dauna;
    globalDaunaCollection = daunaCollection;
    
    router.get('/daune', function(req, res) {
        console.log("get dauna");
    
        var cursorDauna = daunaCollection.find({daunaConfirmata: false});
        
        var dauneArray = [];
        
        cursorDauna.each( function(err, doc){
            if (err){
                helpers.sendErrorResponse(res, err, '/login');
                return;
            }else{
                if (doc === null){
                    res.send(JSON.stringify({status: 'ok', message: dauneArray}));
                    return;
                } else {
                    console.log(doc);
                    dauneArray.push(doc);
                }
            }
        });
    
    });
    
    router.post('/dauna', function(req, res) {
       console.log("post dauna");
       console.log(req.body);
    
        var params = {
            "marca": 'string',//'array',
            "polita": "string",
            "inmatriculare": "string",
            "cnp": "string",//"int",
            "model": "string",
            "location":"string",
            "description":"string",
            "username":"string",
            "urlimagine":"string"
        };
        var message;
        if ( (message = helpers.validateParams(params, req.body)) !== null ) {
            helpers.sendErrorResponse(res, message);
            return;
        }
    
        req.body.daunaConfirmata = false;
        daunaCollection.insertOne(req.body, function(err, response) {
            if (err) {
                helpers.sendErrorResponse(res, err, '/register');
                return;
            }
            helpers.sendOkResponse(res,  'Constatare dauna adaugata', '/introduceredauna');
        });
    });
    
    router.post('/updateDauna', function (req, res) {
        console.log("post update Dauna");
        console.log(req.body);
        var params = {
            idDauna: 'string',
            idService: 'string'
        };
        daunaCollection.updateOne(
            {_id: new ObjectID(req.body.idDauna)},
            {'$set': {'daunaConfirmata': true, 'serviceId': req.body.idService}},
            function (err, result) {
                if (err) {
                    helpers.sendErrorResponse(res, err);
                    return;
                }
                helpers.sendOkResponse(res, "Dauna trimisa in service");
            }
        );
    });
    
    return router;
};

module.exports.updateDaunaWithDriveID = function( polita, username, fileGDriveId) {
    console.log(polita + " " + username + " "+ fileGDriveId);
    globalDaunaCollection.update(
            {polita:polita, username:username},//, username:username
            {'$set': {'urlimagine': "https://docs.google.com/uc?id=" + fileGDriveId}},
            function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("file id updated" + result);
            }
        );
};