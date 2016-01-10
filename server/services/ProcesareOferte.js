var express = require ("express");
var router = express.Router()

var helpers = require("./../helpers");

module.exports.getRouter = function(collections) {
    var cerereCollection = collections['cerere'];
    var userCollection = collections['users'];
    var daunaCollection = collections['dauna'];
    var serviceCollection = collections['service'];
    
    return router;
}
