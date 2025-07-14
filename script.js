const editor = document.getElementById('editor');
const status = document.getElementById('status');
let ws;
let isTyping = false;
let ignoreChange = false;

// Connect to WebSocket server
function connect() {
  ws = new WebSocket(`ws://${location.host}`);

  ws.onopen = () => {
    status.textContent = "Connected. Start collaborating!";
    status.style.color = "#2ecc40";
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'init') {
      ignoreChange = true;
      editor.value = data.content;
      ignoreChange = false;
    } else if (data.type === 'update') {
      ignoreChange = true;
      editor.value = data.content;
      ignoreChange = false;
    }
  };

  ws.onclose = () => {
    status.textContent = "Disconnected. Reconnecting...";
    status.style.color = "#e74c3c";
    setTimeout(connect, 1000);
  };
}

editor.addEventListener('input', () => {
  if (ignoreChange) return;
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'edit', content: editor.value }));
  }
});

connect();
