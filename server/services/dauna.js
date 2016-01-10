var express = require ("express");
var router = express.Router();

var helpers = require("./../helpers");
var ObjectID = require('mongodb').ObjectID;
    
module.exports.getRouter = function(collections) {
    var cerereCollection = collections['cerere'];
    var userCollection = collections['users'];
    var daunaCollection = collections['dauna'];
    
    router.post('/dauna', function(req, res) {
       console.log("post dauna");
       console.log(req.body);
    
        var params = {
            "marca": 'array',
            "polita": "string",
            "inmatriculare": "string",
            "cnp": "int",
            "model": "string",
            "location":"string",
            "description":"string",
            "username":"string",
        }
        var message;
        if ( (message = helpers.validateParams(params, req.body)) != null ) {
            helpers.sendErrorResponse(res, message);
            return;
        }
    
        daunaCollection.insertOne(req.body, function(err, response) {
            if (err) {
                helpers.sendErrorResponse(res, err, '/register');
                return;
            }
            helpers.sendOkResponse(res,  'Constatare dauna adaugata', '/login');
        });
    });
    
    router.get('/daune', function(req, res) {
        console.log("get dauna");
    
        var cursorDauna = daunaCollection.find();
        
        var dauneArray = [];
        
        cursorDauna.each( function(err, doc){
            if (err){
                helpers.sendErrorResponse(res, err, '/login');
                return;
            }else{
                if (doc == null){
                    res.send(JSON.stringify({status: 'ok', message: dauneArray}));
                    return;
                } else {
                    console.log(doc);
                    dauneArray.push(doc);
                }
            }
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
            {'$set': {'daunaConfirmata': true}},
            {'$set': {'serviceId': req.body.idService}},
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
}