var express = require ("express");
var router = express.Router();

var helpers = require("./../lib/helpers");

/**
 * Edit user role.
 * 
 * @param {string} username
 * @param {string} role
 */ 
function editRole(userCollection, req, res) {
    console.log("post editRole");
    console.log(req.body);
    var params = {
        'username': 'string',
        'role': 'string'
    };
    
    var message;
    if ( (message = helpers.validateParams(params, req.body)) !== null ) {
        helpers.sendErrorResponse(res, message);
        return;
    }
    
    userCollection.findOne({username:req.body.username}, function(err, doc) {
        if (err) {
           helpers.sendErrorResponse(res, err);
           return;
        }
        if (doc === null) {
            helpers.sendErrorResponse(res, "User does not exist");
            return;
        }
        userCollection.updateOne({username: req.body.username}, {'$set': {role: req.body.role}}, function(err, doc) {
            if (err) {
                helpers.sendErrorResponse(res, err);
                return;
            }
            helpers.sendOkResponse(res, "User role changed");
        });
    });
}


/**
  * Registers routes for Roluri module
  * 
  * @param collection Database collections that can be accessed from module
  */ 
module.exports.getRouter = function(collections) {
    var userCollection = collections.users;
    
    router.post('/editRole', function(req, res) {
        editRole(userCollection, req, res);
    });
    
    return router;
};
