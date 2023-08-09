const io = require('socket.io');

let socketServer;
const connectedUsers = {};

function setupSocketServer(server) {
  socketServer = io(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  socketServer.on('connection', (socket) => {
    socket.on('setUserId', (userId) => {
      connectedUsers[userId] = socket.id;
      socketServer.to(socket.id).emit('connectedUsers', connectedUsers[userId]);
      console.log('Utenti connessi:', connectedUsers);
    });

    socket.on('disconnectedUser', (userId) => {
      delete connectedUsers[userId];
      console.log('Utenti connessi:', connectedUsers);
    });

    socket.on('disconnect', () => {
      console.log('Web socket disconnesso');
    });
  });

  return { socketServer, connectedUsers}
}



module.exports = { setupSocketServer };
