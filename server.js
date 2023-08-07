const app = require('./app');
const http = require('http');
const { setupSocketServer } = require('./socketServer');

const server = http.createServer(app);
const socket = setupSocketServer(server);



app.set('socketServer', socket.socketServer);
app.set('connectedUsers', socket.connectedUsers);




server.listen(3003, () => {
  console.log('Il server è in esecuzione sulla porta 3003');
});
