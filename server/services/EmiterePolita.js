var express = require ("express");
var router = express.Router();

var helpers = require("./../helpers");

var ObjectID = require('mongodb').ObjectID;

module.exports.getRouter = function(collections) {
    var cerereCollection = collections['cerere'];
    var userCollection = collections['users'];
    
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
    
    return router;
}
