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
    cb(null, file.originalname) //Appending .jpg
  }
})

var upload = multer({ storage: storage })


module.exports.getRouter = function(collections) {
    
    
    router.post('/upload', upload.single('file'), function(req, res) {
        console.log("photo upload");
        console.log(req.file.mimetype);
        helpers.sendErrorResponse(res, "");
    });
    
    router.use('/uploads/:fname', function(req, res){
        console.log(req.params.fname);
        res.sendFile("secondarytile.png", {root: __dirname + '/../uploads'});

    });
    
    return router;
}