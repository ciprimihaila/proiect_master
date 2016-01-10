var express = require ("express");
var router = express.Router()

var helpers = require("./../helpers");

module.exports.getRouter = function(collections) {
    var cerereCollection = collections['cerere'];
    var userCollection = collections['users'];
    var daunaCollection = collections['dauna'];
    var serviceCollection = collections['service'];
    
    router.get('/daune', function(req, res) {
        console.log("get dauna");
    
        var cursorDauna = daunaCollection.find({daunaConfirmata: false});
        
        var dauneArray = [];
        
        cursorDauna.each( function(err, doc){
            if (err){
                helpers.sendErrorResponse(res, err, '/login');
                return;
            }else{
                if (doc == null){
                    res.send(JSON.stringify({status: 'ok', message: dauneArray}));
                    return;
                } else {
                    console.log(doc);
                    dauneArray.push(doc);
                }
            }
        });
    
    });
    
    return router;
}