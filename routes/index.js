let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let mainDb = new Datastore({filename: "storage/reddit_main.db", autoload: true});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect("/api-docs");
});

module.exports = router;
