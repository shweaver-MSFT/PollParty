const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const url = require('url');
const bodyParser = require('body-parser')
const questionData = require('./public/api/questionData');
const sessionData = require('./public/api/sessionData');

const hostname = '127.0.0.1';
const port = 3000;

var app = express();
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')));

// Audience experience
app.get('/web', function (req, res) {

    let fileName = path.join(__dirname, '/public/web', 'index.html');
    fs.readFile(fileName, function (err, data) {
        res.statusCode = 200;
        res.write(data);
        res.end();
    });
});

// Presenter experience
app.get('/add-in', function (req, res) {
    let fileName = path.join(__dirname, '/public/add-in', 'index.html');
    fs.readFile(fileName, function (err, data) {
        res.statusCode = 200; // OK
        res.write(data);
        res.end();
    });
});

// routes for question CRUD operations
//app.get('*/api/question', function (req, res) {
/*
    try {
        let presentationId = req.query.pid;
        let slideId = parseInt(req.query.sid);

        // Question id is simple combination of presentation id and slide id
        let question = questionData.get(presentationId, slideId);

        if (question === null) {
            res.statusCode = 204; // No Content
        }

        res.statusCode = 200; // OK
        res.json(question);
    }
    catch (e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }
})
*/
//app.post('*/api/question', function (req, res) {
/*
    try {
        let presentationId = req.query.pid;
        let slideId = parseInt(req.query.sid);
        let questionText = req.query.text;

        

        // Question id is simple combination of presentation id and slide id
        let result = questionData.save(presentationId, slideId, questionText);

        if (result === null) {
            res.statusCode = 204; // No Content
        }

        res.statusCode = 200; // OK
        res.json(result);
    }
    catch (e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }
});
*/
// Route for getting or creating a session based on presentation and slide ids.
// Used when presenting live
//app.get('*/api/session/pid/:pid/sid/:sid', function (req, res) {
/*
    try {
        let presentationId = req.params.pid;
        let slideId = parseInt(req.params.sid);
        
        let session = sessionData.getCreate(presentationId, slideId);

        res.statusCode = 200; // OK
        res.json(session);
    }
    catch (e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }
});
*/
// Route for adding responses to an active session
//app.post('*/api/session/:code/response/:response', function (req, res) {
/*
    try {
        let code = parseInt(req.params.code);
        let response = parseInt(req.params.response);

        let success = sessionData.addResponse(code, response);
        if (success === false) {
            res.statusCode = 204; // No Content
            return;
        }

        res.statusCode = 200; // OK
    }
    catch (e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }
});
*/
/*
// TODO: this may change, testing api, update as needed
res.setHeader('Content-Type', 'application/json');  
var sessionId = session.createSession(1, 1);  
var question = session.joinSession(sessionId, 1);
var success = session.updateSession(sessionId, 1, true);
session.updateSession(sessionId, 1, true);    
session.updateSession(sessionId, 1, false);
var responses = session.getSession(sessionId, 1);
res.json(responses);
*/

// Invalid path
/*
app.all("*", function(req, res) {

    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    res.statusCode = 404; // Not Found
    res.end();
});
*/

let state = {
    sessions: [],
    questionSets: []
};
const Models = require('./public/api/models');


// Get questions for a presentation
app.get('*/api/questions/pid/:pid', function (req, res) {

    try {        
        let presentationId = req.params.pid;
        console.log(`GET */api/questions/pid/${presentationId}`);

        let questionSet = state.questionSets.find((qs) => qs.presentationId === presentationId);
        
        if (questionSet !== undefined) {
            res.statusCode = 200; // OK
            res.json(questionSet);
        }
        else {
            res.statusCode = 204; // No Content
            console.log("204 No Content");
        }
    }
    catch (e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }
});

// Save a question
app.post('*/api/question/save', function (req, res) {

    try {
        let presentationId = req.query.pid;
        let slideId = req.query.sid;
        let questionText = req.query.text;

        console.log(`POST */api/question/save/pid/${presentationId}/sid/${slideId}/text/${questionText}`);

        let questionSet = state.questionSets.find((qs) => qs.presentationId === presentationId);

        if (questionSet === undefined) {
            questionSet = new Models.QuestionSet(presentationId);
            questionSet.addUpdateQuestion(slideId, questionText);
            state.questionSets.push(questionSet);
        }
        else {
            questionSet.addUpdateQuestion(slideId, questionText);
        }

        res.statusCode = 200; // OK
        res.json(questionSet);
    }
    catch (e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }
});

// Create a new session for a live presentation
app.post('*/api/session/create', function (req, res) {

    try {
        let presentationId = req.query.pid;
        let session = new Models.Session(presentationId);
        state.sessions.push(session);

        console.log(`POST */api/session/create/pid/${presentationId}`);

        res.statusCode = 200; // OK
        res.json(session);
    }
    catch (e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }
});


// Get a session by code
app.get('*/api/session/:code', function (req, res) {

    try {
        let code = req.params.code;
        let session = state.sessions.find((s) => s.code == code);

        console.log(`GET */api/session/${code}`);

        if (session === null) {
            res.statusCode = 204; // No Content
            return;
        }

        res.statusCode = 200; // OK
        res.json(session);
    }
    catch (e) {
        res.statusCode = 500; // Internal server error
        console.log(e);
    }
    finally {
        res.end();
    }

    return;
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});