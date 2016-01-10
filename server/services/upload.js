var express = require ("express");
var router = express.Router();
var multer  = require('multer')

var helpers = require("./../helpers");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    var extension = file.mimetype.split("/")[1];
    console.log(extension);
    cb(null, Date.now() + "." +extension) //Appending .jpg
  }
})

var upload = multer({ storage: storage })

module.exports.getRouter = function(collections) {
    
    
    router.post('/upload', upload.single('file'), function(req, res) {
        console.log("photo upload");
        console.log(req.file.mimetype);
        helpers.sendErrorResponse(res, "");
    });
    
    return router;
}