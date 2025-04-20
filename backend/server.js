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
const server = http.createServer(app);
 // Keeps track of users in each room
 // 👈 Attach Express to a custom server
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

// Replace your QUIZ SOCKET.IO LOGIC section with this improved version

// ------------------------ QUIZ SOCKET.IO LOGIC ------------------------
const questions = [
  {
    question: "Which data structure uses LIFO (Last In First Out)?",
    answers: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1
  },
  {
    question: "Which of the following is a type of Normal Form in DBMS?",
    answers: ["First Normal Form (1NF)", "Entity Form", "Key Form", "Primary Form"],
    correctAnswer: 0
  },
  {
    question: "What does a semaphore help prevent in Operating Systems?",
    answers: ["Data Redundancy", "Deadlock", "Memory Leak", "Page Fault"],
    correctAnswer: 1
  },
  {
    question: "Which protocol is used to send emails?",
    answers: ["FTP", "SMTP", "HTTP", "SNMP"],
    correctAnswer: 1
  },
  {
    question: "What is the time complexity of binary search in a sorted array?",
    answers: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    correctAnswer: 2
  },
  {
    question: "Which of the following is not a type of DBMS?",
    answers: ["Relational", "Hierarchical", "Network", "Modular"],
    correctAnswer: 3
  },
  {
    question: "Which scheduling algorithm gives the minimum average waiting time?",
    answers: ["First-Come-First-Serve", "Round Robin", "Shortest Job First", "Priority Scheduling"],
    correctAnswer: 2
  },
  {
    question: "What does DNS stand for in networking?",
    answers: ["Dynamic Name System", "Domain Name System", "Data Name Service", "Domain Network Service"],
    correctAnswer: 1
  },
  {
    question: "Which algorithm is used for finding the shortest path in a graph?",
    answers: ["Kruskal's Algorithm", "Prim's Algorithm", "Dijkstra's Algorithm", "Bellman-Ford Algorithm"],
    correctAnswer: 2
  },
  {
    question: "What is the primary purpose of an operating system?",
    answers: ["To compile code", "To provide a user interface", "To manage computer hardware and software", "To debug programs"],
    correctAnswer: 2
  }
];

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId, playerName) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: {},
        currentQuestion: 0,
        questionTimer: null
      };
    }

    rooms[roomId].players[socket.id] = {
      id: socket.id,
      name: playerName,
      score: 0
    };

    console.log(`Player ${playerName} joined room ${roomId}`);
    
    // Update all players with the current scores
    io.to(roomId).emit("updateScores", getScoresArray(roomId));

    // Start game when at least one player has joined
    // For testing, we'll start with just one player
    // In production, you might want to wait for 2+ players
    if (Object.keys(rooms[roomId].players).length >= 1) {
      setTimeout(() => sendQuestion(roomId), 2000);
    }
  });

  socket.on("submitAnswer", (roomId, answerIndex) => {
    const room = rooms[roomId];
    if (!room) return;
    
    const player = room.players[socket.id];
    if (!player) return;

    const currentQuestionIndex = room.currentQuestion;
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;

    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    if (isCorrect) {
      player.score += 10;
    }

    // Clear the question timer to prevent auto-proceeding
    clearTimeout(room.questionTimer);

    // Send answer result to all players in the room
    io.to(roomId).emit("answerResult", {
      playerName: player.name,
      isCorrect,
      correctAnswer: currentQuestion.answers[currentQuestion.correctAnswer],
      scores: getScoresArray(roomId)
    });

    // Check if we should end the game
    const highestScore = Math.max(...Object.values(room.players).map(p => p.score));
    if (highestScore >= 50 || currentQuestionIndex >= questions.length - 1) {
      // Find the winner(s)
      const winners = Object.values(room.players)
        .filter(p => p.score === highestScore)
        .map(p => p.name);
      
      io.to(roomId).emit("gameOver", {
        winner: winners.join(" & "), // In case of a tie
        scores: getScoresArray(roomId)
      });
      
      // Clean up the room after a delay
      setTimeout(() => {
        delete rooms[roomId];
      }, 10000);
    } else {
      // Move to next question after a delay
      setTimeout(() => {
        room.currentQuestion = (room.currentQuestion + 1) % questions.length;
        sendQuestion(roomId);
      }, 3000);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Check all rooms for this player
    for (const roomId in rooms) {
      const room = rooms[roomId];
      
      // If player was in this room
      if (room.players[socket.id]) {
        // Remove player
        delete room.players[socket.id];
        
        // Notify remaining players
        io.to(roomId).emit("playerLeft", {
          playerId: socket.id,
          message: `${room.players[socket.id]?.name || 'A player'} has left the game`,
          scores: getScoresArray(roomId)
        });
        
        // If room is empty, clean it up
        if (Object.keys(room.players).length === 0) {
          clearTimeout(room.questionTimer);
          delete rooms[roomId];
        }
      }
    }
  });
});

// Helper function to get scores in the expected format
function getScoresArray(roomId) {
  const room = rooms[roomId];
  if (!room) return [];
  
  return Object.values(room.players).map(p => ({
    name: p.name,
    score: p.score
  }));
}

// Send the current question to all players in a room
function sendQuestion(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  
  const currentQuestionIndex = room.currentQuestion;
  const question = questions[currentQuestionIndex];
  
  if (!question) {
    console.error("No question found at index", currentQuestionIndex);
    return;
  }
  
  // Send the question to all players in the room
  io.to(roomId).emit("newQuestion", {
    question: question.question,
    answers: question.answers,
    timer: 10
  });
  
  // Set a timer to auto-proceed if no one answers
  room.questionTimer = setTimeout(() => {
    io.to(roomId).emit("answerResult", {
      playerName: "Time's up!",
      isCorrect: false,
      correctAnswer: question.answers[question.correctAnswer],
      scores: getScoresArray(roomId)
    });
    
    // Move to next question after timeout
    setTimeout(() => {
      room.currentQuestion = (room.currentQuestion + 1) % questions.length;
      sendQuestion(roomId);
    }, 3000);
  }, 10000); // 10 seconds timeout
}
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});