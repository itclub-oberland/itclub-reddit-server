let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let mainDb = new Datastore({filename: "storage/reddit_main.db", autoload: true});

/* GET home page. */
router.get('/', function (req, res) {
    console.log("Hacim",req.url);
    res.redirect("/api-docs");
});

router.put('/activeUser', function (req, res) {
    if (req.body.__type === "User") {
        mainDb.update({__type: "User"}, req.body, {upsert: true}, function (err, updatedDocNum) {
            if (err) {
                res.status(400).json({message: err});
            } else {
                res.status(200).json({message: `${updatedDocNum} docs updated.`});
            }
        });
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'User'."});
    }
});

router.get('/activeUser', function (req, res) {
    mainDb.findOne({__type: "User"}, function (err, foundDoc) {
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

router.delete('/activeUser', function (req, res) {
    mainDb.remove({__type: "User"}, function (err, docs) {
        if (err) {
            res.status(400).json({message: "Something went wrong clearing the active User!"});
        } else {
            res.status(200).json({message: "Active User cleared!"});
        }
    });
});

router.put('/activeTopic', function (req, res) {
    if (req.body.__type === "Topic") {
        mainDb.update({__type: "Topic"}, req.body, {upsert: true}, function (err, updatedDocNum) {
            if (err) {
                res.status(400).json({message: err});
            } else {
                res.status(200).json({message: `${updatedDocNum} docs updated.`});
            }
        });
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'Topic'."});
    }
});

router.get('/activeTopic', function (req, res) {
    mainDb.findOne({__type: "Topic"}, function (err, foundDoc) {
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

router.delete('/activeTopic', function (req, res) {
    mainDb.remove({__type: "Topic"}, function (err, docs) {
        if (err) {
            res.status(400).json({message: "Something went wrong clearing the active topic!"});
        } else {
            res.status(200).json({message: "Active topic cleared!"});
        }
    });
});

router.delete("/", function (req, res) {
    mainDb.remove({}, {multi: true}, function (err, docs) {
        if (err) {
            res.status(400).json({message: "Something went wrong clearing the storage!"});
        } else {
            res.status(200).json({message: "Storage cleared!"});
        }
    });
});

module.exports = router;
