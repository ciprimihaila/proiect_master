var express = require ("express");
var router = express.Router()

var helpers = require("./../helpers");

module.exports.getRouter = function(collections) {
    var userCollection = collections['users'];

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
    
    
    return router;
}
