const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store active watch sessions
const watchSessions = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'CREATE_ROOM':
        const roomId = uuidv4();
        watchSessions.set(roomId, {
          host: ws,
          participants: new Set([ws]),
          movieId: data.movieId,
          currentTime: 0,
          isPlaying: false
        });
        ws.roomId = roomId;
        ws.send(JSON.stringify({ type: 'ROOM_CREATED', roomId }));
        break;

      case 'JOIN_ROOM':
        const session = watchSessions.get(data.roomId);
        if (session) {
          session.participants.add(ws);
          ws.roomId = data.roomId;
          ws.send(JSON.stringify({
            type: 'JOINED_ROOM',
            movieId: session.movieId,
            currentTime: session.currentTime,
            isPlaying: session.isPlaying
          }));
          // Notify others that someone joined
          broadcastToRoom(data.roomId, {
            type: 'PARTICIPANT_JOINED',
            participantCount: session.participants.size
          }, ws);
        }
        break;

      case 'SYNC_TIME':
        const roomSession = watchSessions.get(ws.roomId);
        if (roomSession) {
          roomSession.currentTime = data.currentTime;
          roomSession.isPlaying = data.isPlaying;
          broadcastToRoom(ws.roomId, {
            type: 'TIME_SYNCED',
            currentTime: data.currentTime,
            isPlaying: data.isPlaying
          }, ws);
        }
        break;
    }
  });

  ws.on('close', () => {
    if (ws.roomId) {
      const session = watchSessions.get(ws.roomId);
      if (session) {
        session.participants.delete(ws);
        if (session.participants.size === 0) {
          watchSessions.delete(ws.roomId);
        } else {
          broadcastToRoom(ws.roomId, {
            type: 'PARTICIPANT_LEFT',
            participantCount: session.participants.size
          });
        }
      }
    }
  });
});

function broadcastToRoom(roomId, message, excludeWs = null) {
  const session = watchSessions.get(roomId);
  if (session) {
    session.participants.forEach(participant => {
      if (participant !== excludeWs && participant.readyState === WebSocket.OPEN) {
        participant.send(JSON.stringify(message));
      }
    });
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 