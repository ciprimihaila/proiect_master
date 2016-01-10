var express = require ("express");
var router = express.Router()

var helpers = require("./../helpers");

module.exports.getRouter = function(collections) {
    var cerereCollection = collections['cerere'];
    var userCollection = collections['users'];
    var daunaCollection = collections['dauna'];
    var serviceCollection = collections['service'];
    
    
    router.get('/cereri', function (req, res) {
        console.log("get cerere");
        
        var cursorCerere = cerereCollection.find({cerereEmisa: false});
        
        var cerereArray = [];
        cursorCerere.each(function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err, '/login');
                return;
            }
            if (doc == null) {
                helpers.sendOkResponse(res, cerereArray);
                return;    
            }
            cerereArray.push(doc);
        });
    });
    
    return router;
}
