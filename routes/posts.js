let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let postsDb = new Datastore({filename: "storage/reddit_posts.db", autoload: true});

/**
 * Gets all posts
 * Query params: topicname, username
 * */
router.get('/', function (req, res, next) {
    let topicname = req.query.topicname;
    let username = req.query.username;
    postsDb.find({_topic: {name: topicname}, _owner: {username: username}},
        function (err, topics) {
            if (err) {
                res.status(400).json({message: "Error occured while trying to retrieve Posts"})
            } else {
                res.status(200).json(topics);
            }
        });
});

/**
 * Adds a Post
 * */
router.post('/', function (req, res, next) {
    if (req.body.__type === "Post") {
        let newPost = req.body;
        postsDb.find({_id: newPost.id}, function (err, posts) {
            if (posts.length === 0) {
                postsDb.insert(newPost, function (err, createdPost) {
                    res.status(201).json(createdPost);
                })
            } else {
                res.status(400).json({messsage: "Post already exists."});
            }
        });
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'Post'."});
    }
});

/**
 * Gets a Topic
 * */
router.get('/:postId', function (req, res, next) {
    postsDb.findOne({_id: req.params.postId}, function (err, foundPost) {
        if (err) {
            res.status(400).json({message: err});
        } else {
            if (foundPost) {
                res.status(200).json(foundPost);
            } else {
                res.status(404).json();
            }
        }
    });
});

/**
 * Updates a Post
 * */
router.put('/:postId', function (req, res, next) {
    if (req.body.__type === "Post") {
        postsDb.update({_id: req.params.postId}, req.body, {}, function (err, updatedPostsNum) {
            if (err) {
                res.status(400).json({message: err});
            } else {
                res.status(200).json({message: `${updatedPostsNum} posts updated.`});
            }
        })
    } else {
        res.status(400).json({message: "Data type not supported. Expected type 'Post'."});
    }
});

/**
 * Removes a Post
 * */
router.delete('/:postId', function (req, res, next) {
    postsDb.remove({name: req.params.postId}, {}, function (err, removedPostNum) {
        if (err) {
            res.status(400).json({message: err});
        } else {
            res.status(200).json({message: `${removedPostNum} posts removed.`});
        }
    });
});

/**
 * Deletes all users
 * */
router.delete("/", function (req, res) {
    postsDb.remove({}, {multi: true}, function (err, docs) {
        if (err) {
            res.status(400).json({message: "Something went wrong clearing the posts storage!"});
        } else {
            res.status(200).json({message: "Posts storage cleared!"});
        }
    });
});

module.exports = router;
