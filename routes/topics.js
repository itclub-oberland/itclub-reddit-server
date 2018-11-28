let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let topicsDb = new Datastore({filename: "storage/reddit_topics.db", autoload: true});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
