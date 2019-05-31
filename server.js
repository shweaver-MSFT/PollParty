const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const url = require('url');
const bodyParser = require('body-parser')
const questionData = require('./public/api/question');
const sessionData = require('./public/api/session');

const hostname = '127.0.0.1';
const port = 3000;

var app = express();
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')));

// Audience experience
app.get('/web', function(req, res) {
    
    let fileName = path.join(__dirname, '/public/web', 'index.html');
    fs.readFile(fileName, function(err, data) {
        res.statusCode = 200;
        res.write(data);
        res.end();
    });
});

// Presenter experience
app.get('/add-in', function(req, res) {
    let fileName = path.join(__dirname, '/public/add-in', 'index.html');
    fs.readFile(fileName, function(err, data) {
        res.statusCode = 200; // OK
        res.write(data);
        res.end();
    });
});

// routes for question CRUD operations
app.get('*/api/question', function(req, res) {
    
    try {
        let presentationId = parseInt(req.query.pid);
        let slideId = parseInt(req.query.sid);

        // Question id is simple combination of presentation id and slide id
        let question = questionData.get(presentationId, slideId);

        if (question === null) {
            res.statusCode = 204; // No Content
        }

        res.statusCode = 200; // OK
        res.json(question);
    }
    catch(e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }
})

// route for get/create session
app.get('/api/session', function(req, res) {
    // TODO: this may change, testing api, update as needed
    res.setHeader('Content-Type', 'application/json');  
    var sessionId = session.createSession(1, 1);  
    var question = session.joinSession(sessionId, 1);
    var success = session.updateSession(sessionId, 1, true);
    session.updateSession(sessionId, 1, true);    
    session.updateSession(sessionId, 1, false);
    var responses = session.getSession(sessionId, 1);
    res.json(responses);    
})


// Invalid path
/*
app.all("*", function(req, res) {

    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    res.statusCode = 404; // Not Found
    res.end();
});
*/
const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});