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
    
        req.body.daunaConfirmata = false;
        daunaCollection.insertOne(req.body, function(err, response) {
            if (err) {
                helpers.sendErrorResponse(res, err, '/register');
                return;
            }
            helpers.sendOkResponse(res,  'Constatare dauna adaugata', '/introduceredauna');
        });
    });
    
    return router;
}