var express = require ("express");
var router = express.Router();

router.use(express.static(__dirname + '/../angular-seed/app'));

router.get('/', function (req, res)
{
    res.sendFile(express.static(__dirname + '/../angular-seed/app/index.html'));
});

module.exports = router;
