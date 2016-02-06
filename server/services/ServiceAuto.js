var express = require ("express");
var router = express.Router();

var helpers = require("./../lib/helpers");

/**
  * Registers routes for ServiceAuto module
  * 
  * @param collection Database collections that can be accessed from module
  */ 
module.exports.getRouter = function(collections) {
    var serviceCollection = collections.service;
        
    
    router.get('/serviceuriAuto', function(req, res) {
        console.log('get serviceuriAuto');
        
        var serviceCursor = serviceCollection.find({});
     
        var serviceArray = [];
        serviceCursor.each(function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err);
                return;
            }
            if (doc === null) {
                helpers.sendOkResponse(res, serviceArray);
                return;    
            }
            serviceArray.push(doc);
        });  
        
    });
        
    router.post('/serviceAuto', function(req, res) {
        console.log("post serviceAuto");
        console.log(req.body);
       
        var params = {
            "name": 'string',
            "cui": "string",
            "contract": "string",
            "address": "string",
            "email": "string",
            "phone":"string",
        };
        var message;
        if ( (message = helpers.validateParams(params, req.body)) !== null ) {
            helpers.sendErrorResponse(res, message);
            return;
        }
        serviceCollection.findOne({name: req.body.name}, function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err);
                return;
            }
            if (doc !== null) {
                helpers.sendErrorResponse(res, "Nume service exista");
                return;
            }
            serviceCollection.insertOne(req.body, function(err, result) {
                if (err) {
                    helpers.sendErrorResponse(res, err);
                    return;
                }
                helpers.sendOkResponse(res, "Service creat", '/service');
            });

        });
    });
    
    return router;
};
