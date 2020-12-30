const express = require('express');
const bodyParser = require('body-parser');
const commentRouter = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/message');

commentRouter.use(bodyParser.json());

commentRouter.route('/')

/*
.get( (req, res, next) => {
    console.log('Received GET request!');
    Message.find({})   // get all the messages - returns a promise
    .then( (msgs) => {
        // Here we should render messages-view
        res.render('messages', {title: 'My Message Server', message: 'Here are the messages...', messages: msgs});
        //res.statusCode = 200;
        //res.contentType('Content-Type', 'application/json');
        //res.json(msgs);
    }, (err) => next(err) )
    .catch( (err) => next(err));
})
*/

.post((req, res, next) => { 
    // Add a new comment to given messageid
    
    //Message.create(req.body)    // create a new message from body (as JSON)

    // For now, find all messages...
    //Message.find({})   // get all the messages - returns a promise
    //.then( (msgs) => {
    console.log('Add new comment!');
    console.log(req.body);
    console.log(req.user);
    Message.findById({_id: req.body.messageid})
    .then( (msg) => {
        // add comment to msg
        // with author
        msg.comments.push(
            // What to insert in JSON-format
            {author: req.user.username,
             content: req.body.comment,
             imageURL: req.body.imageURL
            }
        );
        
        // Do we need this?
        msg.save({j: true});
        // wait for msg to be saved...?
        
        res.redirect(`/messages/${msg._id}`)
        res.render('messagedisp', {title: 'My Message Server', message: msg});

        //res.statusCode = 200;
        //res.contentType('Content-Type', 'application/json');
        //res.json(msg);

    } 
    //res.render('messages', {title: 'My Message Server', message: "Comment added!",  messages: msgs});
    , (err) => next(err) )
    .catch( (err) => next(err) );
})

.put( (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/html');
    res.end('PUT operation not supported!');
})


module.exports = commentRouter;
