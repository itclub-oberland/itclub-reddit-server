let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let postsDb = new Datastore({filename: "storage/reddit_posts.db", autoload: true});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
