const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const url = require('url');
const question = require('./data/question');
const session = require('./data/session');

const hostname = '127.0.0.1';
const port = 3000;

var app = express();

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
        res.statusCode = 200;
        res.write(data);
        res.end();
    });
});

// routes for question CRUD operations
app.get('/api/question', function(req, res) {
    // TODO: inspect request for presentation and slide ids
    // Lookup the data and return as json.
    res.setHeader('Content-Type', 'application/json');
    var id = 1;
    res.json(question.get(id));
})

// route for create session
app.get('/api/createsession', function(req, res) {
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
app.all("*", function(req, res) {

    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    res.statusCode = 404;
    res.end();
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});