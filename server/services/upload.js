var express = require ("express");
var router = express.Router();
var multer  = require('multer');

var helpers = require("./../lib/helpers");

var drive = require("./../lib/gdrive");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    var extension = file.mimetype.split("/")[1];
    console.log(extension);
    cb(null, file.originalname); //Appending .jpg
  }
});

var upload = multer({ storage: storage });


module.exports.getRouter = function(collections) {
    
    
    router.post('/upload', upload.single('file'), function(req, res) {
        console.log("photo upload");
        console.log(req.file.mimetype);
        helpers.sendErrorResponse(res, "");
        //console.log(req);
        console.log("filename " + req.file.originalname);
        var fileSaveName = req.body.user + "##" + req.body.id;
        drive.uploadToGoogledrive("uploads/" + req.file.originalname, fileSaveName);
    });
    
    router.use('/uploads/:fname', function(req, res){
        console.log(req.params.fname);
        console.log("test");
        res.sendFile("secondarytile.png", {root: __dirname + '/../uploads'});

    });
    
    return router;
};