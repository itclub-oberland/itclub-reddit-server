let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let topicsDb = new Datastore({filename: "storage/reddit_topics.db", autoload: true});


/**
 * Gets all topics
 * */
router.get('/', function (req, res, next) {
    topicsDb.find({}, function (err, topics) {
        res.status(200).json(topics);
    });
});

/**
 * Adds a Topic
 * */
router.post('/', function (req, res, next) {
    if (req.body.__type === "Topic") {
        let topic = req.body;
        topicsDb.find({name: topic.name}, function (err, docs) {
            if (docs.length === 0) {
                topicsDb.insert(topic, function (err, newTopic) {
                    res.status(201).json(newTopic);
                })
            } else {
                res.status(400).json({message: "Topic already exists."});
            }
        });
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'Topic'."});
    }
});

/**
 * Gets a Topic
 * */
router.get('/:topicname', function (req, res, next) {
    topicsDb.findOne({name: req.params.topicname}, function (err, foundTopic) {
        if (err) {
            res.status(400).json({message: err});
        } else {
            if (foundTopic) {
                res.status(200).json(foundTopic);
            } else {
                res.status(404).json();
            }
        }
    });
});

/**
 * Updates a Topic
 * */
router.put('/:topicname', function (req, res, next) {
    if (req.body.__type === "Topic") {
        topicsDb.update({name: req.params.topicname}, req.body, {}, function (err, updatedTopicsNum) {
            if (err) {
                res.status(400).json({message: err});
            } else {
                res.status(200).json({message: `${updatedTopicsNum} topics updated.`});
            }
        })
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'Topic'."});
    }
});

/**
 * Removes a Topic
 * */
router.delete('/:topicname', function (req, res, next) {
    topicsDb.remove({name: req.params.topicname}, {}, function (err, removedTopicsName) {
        if (err) {
            res.status(400).json({message: err});
        } else {
            res.status(200).json({message: `${removedTopicsName} topics removed.`});
        }
    });
});

/**
 * Deletes all topics
 * */
router.delete("/",function(req,res){
    topicsDb.remove({}, { multi: true },function(err, docs){
        if(err){
            res.status(400).json({message:"Something went wrong clearing the topics storage!"});
        }else{
            res.status(200).json({message:"Topics storage cleared!"});
        }
    });
});

module.exports = router;
