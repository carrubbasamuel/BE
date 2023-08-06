const app = require('./app');
const http = require('http');
const io = require('socket.io');

const server = http.createServer(app);
const socketServer = io(server, {
  cors: {
    origin: '*',
  },
});

const connectedUsers = {}; // Mappa che associa l'ID utente con l'ID Socket.IO

socketServer.on('connection', (socket) => {
  console.log('Nuova connessione');

  // Listener per il messaggio "like"
  socket.on('like', (data) => {
    const ownerIdSocketId = connectedUsers[data];

    if (ownerIdSocketId) {
      socketServer.to(ownerIdSocketId).emit('notification', 'Qualcosa di interessante è successo!');
    }
  });

  socket.on('setUserId', (userId) => {
    console.log('setUserId', userId);
    connectedUsers[userId] = socket.id;
  });

  // Listener per la disconnessione dell'utente
  socket.on('disconnect', () => {
    // Rimuovi l'associazione quando l'utente si disconnette
    const userId = Object.keys(connectedUsers).find((key) => connectedUsers[key] === socket.id);
    if (userId) {
      delete connectedUsers[userId];
    }
  });
});

server.listen(3003, () => {
  console.log('Il server è in esecuzione sulla porta 3003');
});
