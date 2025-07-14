const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let documentContent = "";

wss.on('connection', function connection(ws) {
  // Send current content to new client
  ws.send(JSON.stringify({ type: 'init', content: documentContent }));

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === 'edit') {
      documentContent = data.content;
      // Broadcast to all other clients
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'update', content: documentContent }));
        }
      });
    }
  });
});

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
