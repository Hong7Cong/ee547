const express = require('express');
const { off } = require('process');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const router = require('express').Router();
// app.use(express.static('/'));
app.use(express.static('views'));
app.use(express.static('public'));
// app.use(express.static(path.join('/', 'public')));
// app.set('views', '/views');
app.engine('html', require('ejs').renderFile);
// app.engine('html', engine.mustache);
app.set('view engine', 'html');

app.get('/room', function(req, res) {
    const vars = {
        roomid: req.params.pid,
        endpoint: '/room/' + req.params.pid
        };
    res.render('index.ejs', vars);
});

app.get('/recommender', function(req, res) {
    res.render('recommender.ejs');
    // res.sendFile('/views/leaderboard.html');
});

app.get('/rate', function(req, res) {
    res.render('rate.html');
    // res.sendFile('/views/leaderboard.html');
});

chat = io.of("/room");
chat.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        chat.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        chat.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        chat.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});