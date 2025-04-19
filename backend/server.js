require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');

const courseRoutes = require('./routes/courseRoutes');
const defaultRoutes = require('./routes/defaultRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB
const db = require('./config/db');
db();

const app = express();
const server = http.createServer(app); // 👈 Attach Express to a custom server
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true
}));



app.use(
  session({
    secret: 'mySuperSecretKey123', // hardcoded session secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/padhakoo', // hardcoded mongo URL
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// Static files & uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/default', defaultRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'landingpage.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ------------------------ QUIZ SOCKET.IO LOGIC ------------------------

const questions = [
  {
    question: "Which data structure uses LIFO (Last In First Out)?",
    answers: [
      { text: "Queue", correct: false },
      { text: "Stack", correct: true },
      { text: "Linked List", correct: false },
      { text: "Tree", correct: false }
    ]
  },
  {
    question: "Which of the following is a type of Normal Form in DBMS?",
    answers: [
      { text: "First Normal Form (1NF)", correct: true },
      { text: "Entity Form", correct: false },
      { text: "Key Form", correct: false },
      { text: "Primary Form", correct: false }
    ]
  },
  {
    question: "What does a semaphore help prevent in Operating Systems?",
    answers: [
      { text: "Data Redundancy", correct: false },
      { text: "Deadlock", correct: true },
      { text: "Memory Leak", correct: false },
      { text: "Page Fault", correct: false }
    ]
  },
  {
    question: "Which protocol is used to send emails?",
    answers: [
      { text: "FTP", correct: false },
      { text: "SMTP", correct: true },
      { text: "HTTP", correct: false },
      { text: "SNMP", correct: false }
    ]
  },
  {
    question: "What is the time complexity of binary search in a sorted array?",
    answers: [
      { text: "O(n)", correct: false },
      { text: "O(n log n)", correct: false },
      { text: "O(log n)", correct: true },
      { text: "O(1)", correct: false }
    ]
  },
  {
    question: "Which of the following is not a type of DBMS?",
    answers: [
      { text: "Relational", correct: false },
      { text: "Hierarchical", correct: false },
      { text: "Network", correct: false },
      { text: "Modular", correct: true }
    ]
  },
  {
    question: "Which scheduling algorithm gives the minimum average waiting time?",
    answers: [
      { text: "First-Come-First-Serve", correct: false },
      { text: "Round Robin", correct: false },
      { text: "Shortest Job First", correct: true },
      { text: "Priority Scheduling", correct: false }
    ]
  },
  {
    question: "What does DNS stand for in networking?",
    answers: [
      { text: "Dynamic Name System", correct: false },
      { text: "Domain Name System", correct: true },
      { text: "Data Name Service", correct: false },
      { text: "Domain Network Service", correct: false }
    ]
  },
  {
    question: "Which algorithm is used for finding the shortest path in a graph?",
    answers: [
      { text: "Kruskal’s Algorithm", correct: false },
      { text: "Prim’s Algorithm", correct: false },
      { text: "Dijkstra’s Algorithm", correct: true },
      { text: "Bellman-Ford Algorithm", correct: false }
    ]
  },
  {
    question: "What is the primary purpose of an operating system?",
    answers: [
      { text: "To compile code", correct: false },
      { text: "To provide a user interface", correct: false },
      { text: "To manage computer hardware and software", correct: true },
      { text: "To debug programs", correct: false }
    ]
  }
];

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId, name) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = { players: {} };

    if (!rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id] = { name, score: 0, timer: null };
      sendNewQuestionToPlayer(roomId, socket.id);
    }
  });

  socket.on("submitAnswer", (roomId, answerIndex) => {
    const player = rooms[roomId]?.players[socket.id];
    if (!player) return;

    const currentQuestion = player.currentQuestion;
    if (!currentQuestion) return;

    const isCorrect = currentQuestion.answers[answerIndex]?.correct;
    if (isCorrect) player.score++;

    clearTimeout(player.timer);

    io.to(socket.id).emit("answerResult", {
      playerName: player.name,
      isCorrect,
      correctAnswer: currentQuestion.answers.findIndex((a) => a.correct),
      scores: Object.values(rooms[roomId].players).map((p) => ({
        name: p.name,
        score: p.score,
      })),
    });

    const winner = Object.values(rooms[roomId].players).find((p) => p.score >= 5);
    if (winner) {
      io.to(roomId).emit("gameOver", { winner: winner.name });
      clearAllPlayerTimers(roomId);
      delete rooms[roomId];
    } else {
      setTimeout(() => sendNewQuestionToPlayer(roomId, socket.id), 1500);
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const player = rooms[roomId].players[socket.id];
      if (player) {
        clearTimeout(player.timer);
        delete rooms[roomId].players[socket.id];
        if (Object.keys(rooms[roomId].players).length === 0) {
          delete rooms[roomId];
        }
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

function sendNewQuestionToPlayer(roomId, socketId) {
  const player = rooms[roomId]?.players[socketId];
  if (!player) return;

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  player.currentQuestion = randomQuestion;

  io.to(socketId).emit("newQuestion", {
    question: randomQuestion.question,
    answers: randomQuestion.answers.map((a) => a.text),
    timer: 10,
  });

  player.timer = setTimeout(() => {
    io.to(socketId).emit("answerResult", {
      playerName: player.name,
      isCorrect: false,
      correctAnswer: randomQuestion.answers.findIndex((a) => a.correct),
      scores: Object.values(rooms[roomId].players).map((p) => ({
        name: p.name,
        score: p.score,
      })),
    });
    setTimeout(() => sendNewQuestionToPlayer(roomId, socketId), 1500);
  }, 10000);
}

function clearAllPlayerTimers(roomId) {
  const players = rooms[roomId]?.players;
  if (!players) return;
  Object.values(players).forEach((p) => clearTimeout(p.timer));
}

// ---------------------------------------------------------------------

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
