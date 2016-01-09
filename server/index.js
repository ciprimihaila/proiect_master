"use strict";


var dbConnection = require("./dbConnection");


// Load express
var express = require ("express");

var app = express ();

app.all(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');

});

app.post ('/', function (req, res)
{
    res.send (
        JSON.stringify(
            {"test": "test"}
        )
    );
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
