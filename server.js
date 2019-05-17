const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express')
const url = require('url');

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