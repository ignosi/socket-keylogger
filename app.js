const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(express.static(__dirname + '/public'));

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret of the auth',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// Socket connection
let io = socket(server);

io.on('connection', (socket) => {
  console.log('A new User connected');
  socket.emit('newMessage', {
    from: 'Admin',
    msg: 'Welcom To the App',
    time: new Date().getTime(),
  });

  /* For broadcasting to every user except the sender, use socket.broadcast.emit()*/

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    msg: 'Hey, Everyone, A new user just got connected',
    time: new Date().getTime(),
  });

  socket.on('keydownevent', (message) => {
    socket.on('keyupevent', (upmsg) => {
      socket.emit('keypressevent', {
        keyType: message.keyType,
        keyupType: upmsg.keyType,
        startTime: message.startTime,
        endTime: upmsg.endTime,
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('User DisConnected to server');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));
