var express = require ("express");
var router = express.Router()

var helpers = require("./../helpers");

module.exports.getRouter = function(collections) {
    var cerereCollection = collections['cerere'];
    var userCollection = collections['users'];
    var daunaCollection = collections['dauna'];
    var serviceCollection = collections['service'];
    
      
    router.get('/serviceuriAuto', function(req, res) {
        console.log('get serviceuriAuto');
        
        var serviceCursor = serviceCollection.find({});
     
        var serviceArray = [];
        serviceCursor.each(function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err);
                return;
            }
            if (doc == null) {
                helpers.sendOkResponse(res, serviceArray);
                return;    
            }
            serviceArray.push(doc);
        });  
        
    });
    
    return router;
}