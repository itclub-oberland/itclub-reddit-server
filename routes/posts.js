let express = require('express');
let router = express.Router();
let Datastore = require("nedb");
let postsDb = new Datastore({filename: "storage/reddit_posts.db", autoload: true});

/**
 * Gets all posts
 * Query params: topicname, username
 * */
router.get('/', function (req, res, next) {
    let search = {};
    if (req.query.topicname) {
        search.__topic = {name: req.query.topicname};
    }
    if (req.query.username) {
        search.owner = {username: req.query.username};
    }

    postsDb.find(search,
        function (err, posts) {
            if (err) {
                res.status(400).json({message: "Error occured while trying to retrieve Posts"})
            } else {
                res.status(200).json(posts);
            }
        });
});

/**
 * Adds a Post
 * */
router.post('/', function (req, res, next) {
    let newPost = JSON.parse(req.body.data);
    if (newPost.__type === "Post") {
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
    let post = JSON.parse(req.body.data);
    if (post.__type === "Post") {
        postsDb.update({_id: req.params.postId}, post, {}, function (err, updatedPostsNum) {
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

function isPostsArray(posts) {
    return posts
        .filter((post) => {
            return post.hasOwnProperty("__type")
                && post.__type === "Post"
        }).length === posts.length;
}

/**
 * Updates with an array of posts
 * TODO: This endpoint isn't really ok...
 * */
router.put("/", function (req, res) {
    let posts = JSON.parse(req.body.data);
    if (isPostsArray(posts)) {
        for (let post of posts) {
            postsDb.update({_id: post._id}, post, {upsert: true}, function (err) {
                if (err) {
                    res.status(400).json({message: "Something went wrong wile updating posts."});
                }
            });
        }
        res.status(200).json({message: "All Posts updated successfully."});
    } else {
        res.status(400).json({message: "Malformed array. Expected array of type 'Post'."});
    }
});

/**
 * Removes a Post
 * */
router.delete('/:postId', function (req, res, next) {
    postsDb.remove({_id: req.params.postId}, {}, function (err, removedPostNum) {
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
