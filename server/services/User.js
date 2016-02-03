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
    
    
    router.post('/user', function (req, res) {
        console.log("post User");
        console.log(req.body);
        var params = {
            'username': 'string',
            'password': 'string',
            'firstName': 'string',
            'lastName': 'string',
            'email': 'string',
            'phone': 'string'
        };
        var message;
        if ( (message = helpers.validateParams(params, req.body)) != null ) {
            helpers.sendErrorResponse(res, message);
            return;
        }
        
        userCollection.findOne({username: req.body.username}, function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err, '/register');
                return;
            }
            if (doc != null) {
                res.send(JSON.stringify({status: 'error', message: "User already exists", url: '/register'}));
                return;
            }
            req.body.role = "User";
            userCollection.insertOne(req.body, function(err, response) {
                if (err) {
                    res.send(JSON.stringify({status: 'error', message: err, url: '/register'}));
                    return;
                }
                res.send(JSON.stringify({status: 'ok', message: 'User succesfully created', url: '/login'}));
            });
        });
        
    });
    
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
