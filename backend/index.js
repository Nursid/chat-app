// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });
// const cors = require("cors")

// app.use(cors());


// io.on('connection', (socket) => {
//   console.log('Client connected');

//   socket.on('createMessage', (msg) => {
//     console.log('Received:', msg);
//     // Broadcast to everyone else
//     socket.broadcast.emit('newMessage', { message: msg.text, time: new Date().toLocaleTimeString() });
//   });

//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

// server.listen(5000, () => console.log('Server running on port 5000'));


const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const { initSocket } = require('./services/socketService');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();


app.use('/api', apiRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  // transports: ['websocket'] // optional
});

initSocket(io);

app.get('/', (req, res)=>{
  return res.status(200).json({message: "API Running..."})
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
// server.listen(PORT, () => {
//   console.log(`✅ Server running at http://192.168.0.196:${PORT}/`);
// });
