var express = require ("express");
var router = express.Router()

var helpers = require("./../helpers");

module.exports.getRouter = function(collections) {
    var userCollection = collections['users'];
    
    router.get('/useri', function(req, res) {
        console.log("get useri");
        console.log(req.query);
        
        var userCursor = userCollection.find({});
        
        var userArray = [];
        userCursor.each(function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err);
                return;
            }
            if (doc == null) {
                helpers.sendOkResponse(res, userArray);
                return;    
            }
            userArray.push(doc);
        });
    });
    
    router.post('/deleteUser', function(req, res) {
        console.log("post delteUserr");
        console.log(req.body);
        var params = {
            'username': 'string'
        };
        
        var message;
        if ( (message = helpers.validateParams(params, req.body)) != null ) {
            helpers.sendErrorResponse(res, message);
            return;
        }
        
        userCollection.findOne({username:req.body.username}, function(err, doc) {
            if (err) {
               helpers.sendErrorResponse(res, err);
               return;
            }
            if (doc == null) {
                helpers.sendErrorResponse(res, "User does not exist");
                return;
            }
        
            userCollection.deleteOne({username: req.body.username}, function(err, result) {
               if (err) {
                   helpers.sendErrorResponse(res, err);
                   return;
               }
               helpers.sendOkResponse(res, "User deleted");
            });
        });
    });
    
    
    return router;
}
