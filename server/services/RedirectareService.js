var express = require ("express");
var router = express.Router();

var helpers = require("./../helpers");
var ObjectID = require('mongodb').ObjectID;
    
module.exports.getRouter = function(collections) {
    var cerereCollection = collections['cerere'];
    var userCollection = collections['users'];
    var daunaCollection = collections['dauna'];

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
}
