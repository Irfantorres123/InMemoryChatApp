var express = require("express");
var router = express.Router();
/* GET home page. */
var messages = {};
var clients = new Set();
router.get("/rooms", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.json([{ id: "room1" }, { id: "room2" }]);
});

function getMessageWithTimeStamp(data) {
  let date = new Date(Date.now());
  return { content: data.content, date: date };
}

function addMessage(data) {
  let messageWithTimeStamp = getMessageWithTimeStamp(data);
  if (!messages[data.roomId]) {
    messages[data.roomId] = new Array();
  }
  let history = messages[data.roomId];
  history.push(messageWithTimeStamp);
  return messageWithTimeStamp;
}

function broadcast(message) {
  clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}

function getResponse(data) {
  if (data.type === "addMessage") {
    broadcast({
      type: "addMessage",
      message: addMessage(data),
      roomId: data.roomId,
    });
  }

  if (data.type == "getMessages") {
    return { type: "getMessages", history: messages };
  }
}

router.ws("/ws", (ws, req) => {
  console.log("Connection opened");
  clients.add(ws);
  ws.on("message", (message) => {
    let data = JSON.parse(message);
    let response = getResponse(data);
    if (response) {
      ws.send(JSON.stringify(response));
    }
  });
  ws.on("close", () => {
    clients.delete(ws);
    console.log("WebSocket was closed");
  });
});

module.exports = router;
