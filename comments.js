// Create web server
// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var url = require('url');
var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Connect to database
mongoose.connect('mongodb://localhost:27017/comments');

// Create schema for comments
var commentSchema = new Schema({
    name: String,
    email: String,
    comment: String
});

// Create model for comments
var Comment = mongoose.model('Comment', commentSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create routes for comments
var router = express.Router();

// Middleware for all requests
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// Route for /comments
router.route('/comments')

    // Create a comment
    .post(function(req, res) {
        var comment = new Comment();
        comment.name = req.body.name;
        comment.email = req.body.email;
        comment.comment = req.body.comment;

        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment created!' });
        });
    })

    // Get all comments
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });

// Route for /comments/:comment_id
router.route('/comments/:comment_id')

    // Update comment
    .put(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            comment.name = req.body.name;
            comment.email = req.body.email;
            comment.comment = req.body.comment;

            comment.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Comment updated!' });
            });
        });
    })

    // Get comment by id
    .get(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json(comment);
        });
    })