var express = require ("express");
var router = express.Router()

var helpers = require("./../helpers");

module.exports.getRouter = function(collections) {
    var userCollection = collections['users'];
    
    router.get('/user', function(req, res) {
        console.log("get User");
        console.log(req.query);
        var params = {
            'username': 'string',
            'password': 'string'
        };
        
        var message;
        if ( (message = helpers.validateParams(params, req.query)) != null ) {
            helpers.sendErrorResponse(res, message);
            return;
        }
   
       userCollection.findOne({username:req.query.username, password:req.query.password}, function(err, doc){
           if (err) {
               helpers.sendErrorResponse(res, err, "/login");
               return;
           }
           console.log("Got");
           console.log(doc);
           if (doc == null) {
                helpers.sendErrorResponse(res, "User does not exist or Incorrect Password", "/login");
           } else {
               if (!doc.role) {doc.role = null;}
               var url = null;
               if (doc.role == 'Broker') {
                   url = '/listacereripolite';
               }
               else if (doc.role == 'Admin') {
                   url = '/usermanagement'
               } else {
                   url = '/cerere';
               }
               
               helpers.sendOkResponse(res, {role: doc.role}, url);
           }
       });
    });
    
    
    return router;
}
