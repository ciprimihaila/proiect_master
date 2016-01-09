"use strict";


var mongoConnectionURL = 'mongodb://localhost:27017';

var MongoClient = require('mongodb').MongoClient;

module.exports = 
{
    connect: function(callback) {

        MongoClient.connect(mongoConnectionURL, function(err, db) {
          if (err) {
              callback(err);
              return;
          }
        
          console.log("Connected correctly to database server.");
          callback(null, db);
        });
        
    }
    
}
