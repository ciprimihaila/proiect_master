"use strict";

/**
 * Validate that the specified keys are available in the object.
 *
 * @param params
 * @param object
 */
function validateParams(params, object) {
    for (var key in params) {
        
        if (object[key] === undefined) {
            return "Parameter " + key + " is required.";
        }
        switch (params[key]) {
            case 'string':
                if (typeof object[key] !== 'string') {
                    return  "Parameter " + key + " should be string.";
                }
                break;
            case 'int':
                object[key] = parseInt(object[key]);
                if (isNaN(object[key])) {
                    return  "Parameter " + key + " should be number.";
                }
                break;
            case 'array':
              break;
            default:
                console.log("The specified type is invalid.");
        }
    }
    return null;
}


require("./dbConnection").connect(
    function(err, db) {
        
        db = db.db('asig');
        var userCollection = db.collection('users');
        var cerereCollection = db.collection('cerere');
        var daunaCollection = db.collection('dauna');
        
        if (err) {
            console.log("Could not connect to db: " + err);
            return;
        }
        
        // Load express
        var express = require ("express");
        var morgan = require ("morgan");
        
        // Load parser for body (URL or JSON)
        var body_parser = require ("body-parser");
        var app = express ();

        app.use(body_parser());

        app.all(function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
        });
        
        app.use(express.static(__dirname + '/angular-seed/app'));

        app.get('/user', function(req, res) {
            console.log("get User");
            console.log(req.query);
            var params = {
                'username': 'string',
                'password': 'string'
            };
            
            var message;
            if ( (message = validateParams(params, req.query)) != null ) {
                res.send(JSON.stringify({status: 'error', 'message': message}));
                return;
            }
           
           userCollection.findOne({username:req.query.username, password:req.query.password}, function(err, doc){
               if (err) {
                   res.send(JSON.stringify({url:"/login", status:"error", 
                                message: err}));
                   return;
               }
               console.log("Got");
               console.log(doc);
               if (doc == null) {
                   res.send(JSON.stringify({url:"/login", status:"error", 
                                message:"User does not exist or Incorrect Password"}));
               } else {
                   if (!doc.role) {doc.role = null;}
                   var url = null;
                   if (doc.role == 'Broker') {
                       url = '/listacereripolite';
                   }
                   else if (doc.role == 'admin') {
                       url = '/usermanagement'
                   } else {
                       url = '/cerere';
                   }
                   
                   res.send(JSON.stringify({url: url, status: "ok", role: doc.role}));
               }
           });
        });

        app.post('/user', function (req, res) {
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
            if ( (message = validateParams(params, req.body)) != null ) {
                res.send(JSON.stringify({status: 'error', 'message': message}));
                return;
            }
            
            userCollection.findOne({username: req.body.username}, function(err, doc) {
                if (err) {
                    res.send(JSON.stringify({status: 'error', message: err, url: '/register'}));
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

        app.post('/dauna', function(req, res) {
           console.log("post dauna");
           console.log(req.body);

            var params = {
                "marca": 'array',
                "polita": "string",
                "inmatriculare": "string",
                "cnp": "int",
                "model": "string",
                "location":"string",
                "description":"string",
            }
            var message;
            if ( (message = validateParams(params, req.body)) != null ) {
                res.send(JSON.stringify({status: 'error', 'message': message}));
                return;
            }
      
            daunaCollection.insertOne(req.body, function(err, response) {
                if (err) {
                    res.send(JSON.stringify({status: 'error', message: err, url: '/register'}));
                    return;
                }
                res.send(JSON.stringify({status: 'ok', message: 'User succesfully created', url: '/login'}));
            });
        });

        app.post('/cerere', function (req, res) {
            console.log("post cerere");
            console.log(req.body);
            var params = {
                marca: 'array',
                model: 'array',
                tipauto: 'array',
                cnp: 'int',
                persfizica: 'string',
                power: 'int',
                serie: 'string',
                combustibil: 'string',
                anfabric: 'int',
                date: 'string',
                username: 'string',
                durata: 'array',
                address: 'string'
            };
            
            if (!req.body.persfizica && !req.body.persjuritica) {
                res.send(JSON.stringify({status: 'error', 'message': "persjuritica sau persfizica nu exista"}));
                return;
            }
            
            var tipPersoana = null;
            if (req.body.persfizica) {
                tipPersoana = 'fizica';
            }
            else {
                tipPersoana = 'juritica';
            }
            
            var message;
            if ( (message = validateParams(params, req.body)) != null ) {
                res.send(JSON.stringify({status: 'error', 'message': message}));
                return;
            }
            
            userCollection.findOne({username: req.body.username}, function(err, doc) {
                if (err) {
                    res.send(JSON.stringify({"status": 'error', "message": err, url: '/register'}));
                    return;
                }
                userCollection.updateOne(
                    {username: req.body.username},
                    {'$set': {address: req.body.address, cnp: req.body.cnp, tipPersoana: tipPersoana}},
                    function (err, response) {
                        if (err) {
                            res.send(JSON.stringify({"status": 'error', "message": err, url: '/register'}));
                            return;
                        }
                        cerereCollection.insertOne(req.body, function(err, result) {
                            if (err) {
                                res.send(JSON.stringify({"status": 'error', "message": err, url: '/register'}));
                                return;
                            }
                            res.send(JSON.stringify({"status": 'ok', "message": "Cerere trimisa", url: '/cerere'}));
                        })
                    }
                )

            })
            
        });

        app.get('/', function (req, res)
        {
            res.sendFile('angular-seed/app/index.html');
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
