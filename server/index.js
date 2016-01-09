"use strict";


require("./dbConnection").connect(
    function(err, db) {
        
        if (err) {
            console.log("Could not connect to db: " + err);
            return;
        }
        
        // Load express
        var express = require ("express");
        var morgan = require ("morgan");
        
        var app = express ();


        app.all(function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
        
        });
        
        app.use(express.static(__dirname + '/angular-seed/app'));

        app.get('/', function (req, res)
        {
            console.log(req);
            var path = require('path');
            res.sendFile(path.resolve('angular-seed/app/index.html'));
        });

        app.use (function (req, res)
        {
            res.send ("No page here, check the url");
        });
        
        app.listen (process.env.PORT);
        
        // catch all exceptions and print
        process.on ('uncaughtException', function (ex)
        {
            console.log ('Exception here!!!');
            console.log (ex); 
        });

    }
);
