"use strict";var mongoConnectionURL="mongodb://localhost:27017",MongoClient=require("mongodb").MongoClient;module.exports={connect:function(a){MongoClient.connect(mongoConnectionURL,function(b,c){return b?void a(b):(console.log("Connected correctly to database server."),void a(null,c))})}};