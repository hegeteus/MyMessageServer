const express = require('express');
const bodyParser = require('body-parser');
const messageRouter = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/message');

messageRouter.use(bodyParser.json());

messageRouter.route('/')

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

.post((req, res, next) => { 
    Message.create(req.body)    // create a new message from body (as JSON)
    .then( (msg) => {
        console.log('Message created: ', msg);
        msg.author = req.user.username;
        //res.statusCode = 200;
        //res.contentType('Content-Type', 'application/json');
        //res.json(msg);
        msg.save({j: true});

        res.render('messagedispwithoptions', {title: 'My Message Server', message: msg});
    }, (err) => next(err) )
    .catch( (err) => next(err) );
})

.put( (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/html');
    res.end('PUT operation not supported!');
})

.delete( (req, res, next) => {
    Message.deleteMany({})
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch( (err) => next(err));
});



// Router for specific message
messageRouter.route('/:messageId')
.get( (req, res, next) => {
    Message.findById(req.params.messageId)
    .then( (msg) => {

        if(msg.author == req.user.username)
        res.render('messagedispwithoptions', {title: 'My Message Server', message: msg});
        else
        res.render('messagedisp', {title: 'My Message Server', message: msg});
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        //res.json(msg);
    }, (err) => next(err) )
    .catch( (err) => next(err));
})

.put((req, res, next) => {
    Message.findByIdAndUpdate(req.params.messageId, {$set: req.body}, {new: true})
    .then( (msg) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(msg);
    }, (err) => next(err))
    .catch ( (err) => next(err));
})

.delete( (req, res, next) => {
    Message.findById(req.params.messageId)
    .then( (msg) => {
        if(msg.author == req.user.username)
        Message.findByIdAndRemove(msg._id);
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        //res.json(resp);
    }, (err) => next(err))
    .catch ( (err) => next(err));
});

// Delete functionality is here because I didn't find a way to simply send a delete method from a form input button in the pug system
messageRouter.route('/:messageId?_delete')
.post( (req, res, next) => {
    Message.findByIdAndRemove(req.params.messageId)
    .then( (resp) => {
        res.redirect('/messages');
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        //res.json(resp);
    }, (err) => next(err))
    .catch( (err) => next(err));
});

/*messageRouter.route('/:messageId/:commentID')
.get( (req, res, next) => {
    Message.findById(req.params.messageId)
    .then( (msg) => {
        msg.comments.find({_id: req.params.commentID})
        .then( (cmnt) => {
            res.render('commentdisp', {title: 'My Message Server', comment: cmnt});
        }, (err) => next(err) )
        .catch( (err) => next(err));
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        //res.json(msg);
    }, (err) => next(err) )
    .catch( (err) => next(err));
});*/

messageRouter.route('/:messageId/:commentID')
.get( (req, res, next) => {
    var commentID = req.params.commentID;
    Message.findById(req.params.messageId)
    .then( (msg) => {
        
        function matchesID(comment) {
            return comment._id == commentID;
          }

        cmnt = msg.comments.find( matchesID );
        if(req.user.username == cmnt.author)
        res.render('commentdispwithoptions', {title: 'My Message Server', comment: cmnt, message: msg});
        else
        res.render('commentdisp', {title: 'My Message Server', comment: cmnt, message: msg});
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        //res.json(msg);
    }, (err) => next(err) )
    .catch( (err) => next(err));
})

// Delete functionality is here in post because I couldn't get the actual delete method to work with this
messageRouter.route('/:messageId/:commentID?_delete')
.post( (req, res, next) => {
    var commentID = req.params.commentID;
    Message.findById(req.params.messageId)
    .then( (msg) => {
        
        var index = msg.comments.length;
        console.log(msg.comments.length);

        while (index--) {
            if (msg.comments[index]._id == commentID) {
                msg.comments.splice(index, 1);
                msg.save({j: true});
                break;
            }
        }

        res.redirect(`/messages/${msg._id}`);
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        //res.json(msg);
    }, (err) => next(err) )
    .catch( (err) => next(err));
})


/*
.post( (req, res, next) => {
    // get json data from request body 
    
    // add messages to our database

})
*/

module.exports = messageRouter;
