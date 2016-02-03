"use strict";

var helpers = require("./helpers");

/* ## Express ## */
var express = require ("express");
var bodyParser = require ("body-parser");


require("./dbConnection").connect(
    function(err, db) {
        
        if (err) {
            console.log("Could not connect to db: " + err);
            return;
        }
        
        /* ## Database name ## */
        db = db.db('asig');
        
        /* ## Available collections ## */
        var collections = {
            users: db.collection('users'),
            cerere: db.collection('cerere'),
            dauna: db.collection('dauna'),
            service: db.collection('service')
        };
        
        var app = express ();
        
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());


        /* ## Return JSON ## */ 
        app.all(function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
        });
                
        /* ## Route files ## */
        var routes = [
            require("./services/angular"),
            require('./services/Polite').getRouter(collections),
            require('./services/Daune').getRouter(collections),
            require('./services/Roluri').getRouter(collections),
            require('./services/ServiceAuto').getRouter(collections),
            require('./services/upload').getRouter(collections),
            require('./services/User').getRouter(collections)
        ];
        
        /* ## Load Routes ## */
        for (var routeKey in routes) {
            app.use(routes[routeKey]);
        }

        app.use (function (req, res)
        {
            res.send ("No page here, check the url");
        });
        
        app.listen (process.env.PORT);

    }
);

        
// catch all exceptions and print
process.on ('uncaughtException', function (ex)
{
    console.log ('Uncaught exception:');
    console.log (ex); 
});
