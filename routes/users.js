let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let usersDb = new Datastore({filename: "storage/reddit_users.db", autoload: true});

/**
 * Gets all users
 * */
router.get('/', function (req, res) {
    usersDb.find({}, function (err, docs) {
        res.status(200).json(docs);
    });
});

/**
 * Adds a User
 * */
router.post('/', function (req, res) {
    let user = JSON.parse(req.body.data);
    if (user.__type === "User") {
        usersDb.find({username: user.username}, function (err, docs) {
            if (docs.length === 0) {
                usersDb.insert(user, function (err, newDoc) {
                    res.status(201).json(newDoc);
                })
            } else {
                res.status(400).json({message: "User already exists."});
            }
        });
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'User'."});
    }
});

/**
 * Gets a User
 * */
router.get('/:username', function (req, res) {
    usersDb.findOne({username: req.params.username}, function (err, foundDoc) {
        if (err) {
            res.status(400).json({message: err});
        } else {
            if (foundDoc) {
                res.status(200).json(foundDoc);
            } else {
                res.status(404).json();
            }
        }
    });
});

/**
 * Updates a User
 * */
router.put('/:username', function (req, res) {
    let user = JSON.parse(req.body.data);
    if (user.__type === "User") {
        usersDb.update({username: req.params.username}, user, {}, function (err, updatedDocNum) {
            if (err) {
                res.status(400).json({message: err});
            } else {
                res.status(200).json({message: `${updatedDocNum} docs updated.`});
            }
        })
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'User'."});
    }
});

/**
 * Removes a User
 * */
router.delete('/:username', function (req, res) {
    usersDb.remove({username: req.params.username}, {}, function (err, removedDocNum) {
        if (err) {
            res.status(400).json({message: err});
        } else {
            res.status(200).json({message: `${removedDocNum} docs removed.`});
        }
    })
});

/**
 * Deletes all users
 * */
router.delete("/", function (req, res) {
    usersDb.remove({}, {multi: true}, function (err, docs) {
        if (err) {
            res.status(400).json({message: "Something went wrong clearing the users storage!"});
        } else {
            res.status(200).json({message: "Users storage cleared!"});
        }
    });
});

module.exports = router;
