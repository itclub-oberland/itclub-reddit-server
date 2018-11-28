let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let usersDb = new Datastore({filename: "storage/reddit_users.db", autoload: true});


/* GET users listing. */
router.get('/', function (req, res, next) {
    usersDb.find(null, function (err, docs) {
        console.log(docs);
        res.status(200).json(docs);
    });
});

/**
 * Add a new User if it doesn't exist
 * */
router.post('/', function (req, res, next) {
    if (req.body.__type === "User") {
        let user = req.body;
        usersDb.find({username: user.username}, function (err, docs) {
            if (docs.length === 0) {
                usersDb.insert(user, function (err, newDoc) {
                    res.status(201).json(newDoc);
                })
            } else {
                res.status(400).json({messsage: "User already exists."});
            }
        });
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'User'."});
    }
});

module.exports = router;
