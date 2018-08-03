const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

var app = express();

//Use to enable static files
app.use(express.static(path.join(__dirname, 'build')));

mongoose.connect('mongodb://localhost/votingapp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    var pollSchema = new mongoose.Schema({
        title: String,
        by: String,
        description: String,
        options: [{
            option: String,
            number: Number
        }]
    });

    var Poll = mongoose.model('Poll', pollSchema);

    app.get('/api', function(req, res) {
        Poll.find(function(err, polls) {
            if (err) return console.error(err);
            res.send(polls);
        });
    });

    app.get('/api/poll/:pollid', function(req, res) {
        Poll.findById(req.params.pollid , function(err, poll) {
            if (err) return console.error(err);
            res.send(poll);
        });
    });

    app.post('/api/createpoll', function(req, res) {
        var newpoll = new Poll({ 
                                title: req.params.title, 
                                by: req.params.by,
                                description: req.params.description, 
                                options: req.params.options
                            });
        newpoll.save(function(err, newpoll) {
            if (err) return console.error(err);
        });
    })
    
});

app.listen(process.env.PORT || 8000);



