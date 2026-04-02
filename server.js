const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

// ─── Game Data ────────────────────────────────────────────────────────────────

const themes = {
  disney_princess: {
    id: 'disney_princess',
    name: 'Disney Princesses',
    emoji: '👸',
    characters: [
      {
        id: 'belle',
        name: 'Belle',
        hint: 'Beauty and the Beast',
        colors: [
          { name: 'Golden Yellow', hex: '#F5C842', textColor: '#7A5C00' },
          { name: 'Warm Brown', hex: '#8B5E3C', textColor: '#FFE4A0' }
        ],
        acceptedNames: ['belle', 'beauty', 'beauty and the beast']
      },
      {
        id: 'cinderella',
        name: 'Cinderella',
        hint: 'Cinderella',
        colors: [
          { name: 'Sky Blue', hex: '#87CEEB', textColor: '#1A5C80' },
          { name: 'Silver', hex: '#B8B8C8', textColor: '#3A3A4A' }
        ],
        acceptedNames: ['cinderella', 'cindy', 'ella']
      },
      {
        id: 'ariel',
        name: 'Ariel',
        hint: 'The Little Mermaid',
        colors: [
          { name: 'Fiery Red', hex: '#E8403C', textColor: '#FFFFFF' },
          { name: 'Sea Teal', hex: '#2BC0B4', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['ariel', 'the little mermaid', 'little mermaid']
      },
      {
        id: 'snow_white',
        name: 'Snow White',
        hint: 'Snow White and the Seven Dwarfs',
        colors: [
          { name: 'Crimson Red', hex: '#C41E3A', textColor: '#FFFFFF' },
          { name: 'Royal Blue', hex: '#2445AB', textColor: '#FFFFFF' },
          { name: 'Pale Yellow', hex: '#F5D800', textColor: '#7A5C00' }
        ],
        acceptedNames: ['snow white', 'snowwhite', 'snow']
      },
      {
        id: 'jasmine',
        name: 'Jasmine',
        hint: 'Aladdin',
        colors: [
          { name: 'Teal', hex: '#20B2AA', textColor: '#FFFFFF' },
          { name: 'Deep Purple', hex: '#6A3D9A', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['jasmine', 'aladdin princess', 'princess jasmine']
      },
      {
        id: 'rapunzel',
        name: 'Rapunzel',
        hint: 'Tangled',
        colors: [
          { name: 'Lilac Purple', hex: '#9B59B6', textColor: '#FFFFFF' },
          { name: 'Blush Pink', hex: '#FF85A1', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['rapunzel', 'tangled', 'pascal']
      },
      {
        id: 'aurora',
        name: 'Aurora',
        hint: 'Sleeping Beauty',
        colors: [
          { name: 'Rose Pink', hex: '#FF9EB5', textColor: '#6B1F35' },
          { name: 'Royal Blue', hex: '#3A5FCD', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['aurora', 'sleeping beauty', 'briar rose']
      },
      {
        id: 'moana',
        name: 'Moana',
        hint: 'Moana',
        colors: [
          { name: 'Coral Red', hex: '#E8484C', textColor: '#FFFFFF' },
          { name: 'Warm Orange', hex: '#FF8C42', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['moana', 'vaiana']
      },
      {
        id: 'mulan',
        name: 'Mulan',
        hint: 'Mulan',
        colors: [
          { name: 'Dusty Rose', hex: '#FF6B8A', textColor: '#FFFFFF' },
          { name: 'Copper Gold', hex: '#D4AF37', textColor: '#5A3E00' }
        ],
        acceptedNames: ['mulan', 'hua mulan', 'fa mulan']
      },
      {
        id: 'tiana',
        name: 'Tiana',
        hint: 'The Princess and the Frog',
        colors: [
          { name: 'Emerald Green', hex: '#27AE60', textColor: '#FFFFFF' },
          { name: 'Warm Gold', hex: '#F39C12', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['tiana', 'princess and the frog', 'princess tiana']
      },
      {
        id: 'elsa',
        name: 'Elsa',
        hint: 'Frozen',
        colors: [
          { name: 'Ice Blue', hex: '#74B9FF', textColor: '#FFFFFF' },
          { name: 'Snow White', hex: '#DFE6E9', textColor: '#4A5568' }
        ],
        acceptedNames: ['elsa', 'frozen elsa', 'ice queen']
      },
      {
        id: 'anna',
        name: 'Anna',
        hint: 'Frozen',
        colors: [
          { name: 'Sky Blue', hex: '#0984E3', textColor: '#FFFFFF' },
          { name: 'Chestnut Brown', hex: '#8B5E3C', textColor: '#FFE4A0' }
        ],
        acceptedNames: ['anna', 'frozen anna', 'princess anna']
      },
      {
        id: 'merida',
        name: 'Merida',
        hint: 'Brave',
        colors: [
          { name: 'Flame Orange', hex: '#E17055', textColor: '#FFFFFF' },
          { name: 'Forest Green', hex: '#00695C', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['merida', 'brave', 'princess merida']
      },
      {
        id: 'pocahontas',
        name: 'Pocahontas',
        hint: 'Pocahontas',
        colors: [
          { name: 'Earthy Brown', hex: '#A0522D', textColor: '#FFFFFF' },
          { name: 'Purple', hex: '#8B5CF6', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['pocahontas', 'poca']
      }
    ]
  },
  disney_classic: {
    id: 'disney_classic',
    name: 'Classic Disney',
    emoji: '🏰',
    characters: [
      {
        id: 'mickey',
        name: 'Mickey Mouse',
        hint: 'Mickey Mouse Clubhouse',
        colors: [
          { name: 'Black', hex: '#2D2D2D', textColor: '#FFFFFF' },
          { name: 'Bright Red', hex: '#D32F2F', textColor: '#FFFFFF' },
          { name: 'Yellow', hex: '#FDD835', textColor: '#5A4000' }
        ],
        acceptedNames: ['mickey', 'mickey mouse', 'mouse']
      },
      {
        id: 'minnie',
        name: 'Minnie Mouse',
        hint: 'Minnie\'s Bow-Toons',
        colors: [
          { name: 'Black', hex: '#2D2D2D', textColor: '#FFFFFF' },
          { name: 'Hot Pink', hex: '#E91E63', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['minnie', 'minnie mouse']
      },
      {
        id: 'donald',
        name: 'Donald Duck',
        hint: 'Donald Duck',
        colors: [
          { name: 'Cobalt Blue', hex: '#1565C0', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['donald', 'donald duck', 'duck']
      },
      {
        id: 'simba',
        name: 'Simba',
        hint: 'The Lion King',
        colors: [
          { name: 'Orange Gold', hex: '#FF8F00', textColor: '#FFFFFF' },
          { name: 'Brown', hex: '#6D4C41', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['simba', 'lion king', 'the lion king']
      },
      {
        id: 'dumbo',
        name: 'Dumbo',
        hint: 'Dumbo',
        colors: [
          { name: 'Blue Gray', hex: '#90A4AE', textColor: '#FFFFFF' },
          { name: 'Light Pink', hex: '#F48FB1', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['dumbo', 'flying elephant', 'jumbo']
      },
      {
        id: 'bambi',
        name: 'Bambi',
        hint: 'Bambi',
        colors: [
          { name: 'Light Tan', hex: '#D2A679', textColor: '#5A3A00' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['bambi', 'little deer', 'deer']
      }
    ]
  }
};

// ─── Room Management ──────────────────────────────────────────────────────────

const rooms = new Map();

function generateRoomCode() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

function sanitizeRoom(room) {
  return {
    code: room.code,
    theme: room.theme,
    host: room.host,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatarColor: p.avatarColor,
      score: p.score,
      isHost: p.isHost
    })),
    state: room.state,
    roundNumber: room.roundNumber
  };
}

// ─── Socket Events ────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('create_room', ({ theme, playerName, avatarColor }) => {
    const roomCode = generateRoomCode();
    const room = {
      code: roomCode,
      theme: theme || 'disney_princess',
      host: socket.id,
      players: [{
        id: socket.id,
        name: playerName || 'Player 1',
        avatarColor: avatarColor || null,
        score: 0,
        isHost: true,
        skipped: false
      }],
      state: 'lobby',
      currentCharacter: null,
      colorAssignments: {},
      roundNumber: 0
    };
    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.emit('room_created', { roomCode, room: sanitizeRoom(room) });
    console.log(`Room ${roomCode} created by ${playerName}`);
  });

  socket.on('join_room', ({ roomCode, playerName, avatarColor }) => {
    const code = (roomCode || '').trim();
    const room = rooms.get(code);

    if (!room) {
      socket.emit('join_error', { message: 'Room not found. Please check the room code.' });
      return;
    }
    if (room.state !== 'lobby') {
      socket.emit('join_error', { message: 'Game already started.' });
      return;
    }
    if (room.players.length >= 12) {
      socket.emit('join_error', { message: 'Room is full (max 12 players).' });
      return;
    }
    if (room.players.find(p => p.id === socket.id)) {
      socket.emit('join_error', { message: 'You are already in this room.' });
      return;
    }

    room.players.push({
      id: socket.id,
      name: playerName || `Player ${room.players.length + 1}`,
      avatarColor: avatarColor || null,
      score: 0,
      isHost: false,
      skipped: false
    });

    socket.join(code);
    socket.data.roomCode = code;
    socket.emit('room_joined', { roomCode: code, room: sanitizeRoom(room) });
    socket.to(code).emit('player_joined', { room: sanitizeRoom(room) });
    console.log(`${playerName} joined room ${code}`);
  });

  socket.on('start_round', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.host !== socket.id) return;

    const themeData = themes[room.theme];
    if (!themeData || themeData.characters.length === 0) return;

    const char = themeData.characters[Math.floor(Math.random() * themeData.characters.length)];
    room.currentCharacter = char;
    room.state = 'playing';
    room.roundNumber++;
    room.players.forEach(p => { p.skipped = false; });
    room.colorAssignments = {};

    room.players.forEach((player, i) => {
      const colorIndex = i % char.colors.length;
      room.colorAssignments[player.id] = char.colors[colorIndex];
    });

    room.players.forEach(player => {
      io.to(player.id).emit('round_started', {
        roundNumber: room.roundNumber,
        yourColor: room.colorAssignments[player.id],
        totalPlayers: room.players.length,
        players: room.players.map(p => ({ id: p.id, name: p.name, avatarColor: p.avatarColor }))
      });
    });

    console.log(`Round ${room.roundNumber} started in ${roomCode}: ${char.name}`);
  });

  socket.on('submit_guess', ({ roomCode, guess }) => {
    const room = rooms.get(roomCode);
    if (!room || room.state !== 'playing') return;

    const char = room.currentCharacter;
    const normalizedGuess = (guess || '').trim().toLowerCase().replace(/\s+/g, ' ').trim();
    const isCorrect = char.acceptedNames.some(
      n => n.toLowerCase() === normalizedGuess
    );

    if (isCorrect) {
      const winner = room.players.find(p => p.id === socket.id);
      if (winner) winner.score++;
      room.state = 'round_end';

      io.to(roomCode).emit('round_ended', {
        winner: winner ? { id: winner.id, name: winner.name, avatarColor: winner.avatarColor } : null,
        character: char,
        scores: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatarColor: p.avatarColor,
          score: p.score,
          isHost: p.isHost
        }))
      });
      console.log(`${winner?.name} won round ${room.roundNumber} with "${guess}"`);
    } else {
      socket.emit('wrong_guess', { guess });
    }
  });

  socket.on('skip_guess', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.state !== 'playing') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player || player.skipped) return;
    player.skipped = true;

    const allSkipped = room.players.every(p => p.skipped);
    if (allSkipped) {
      room.state = 'round_end';
      io.to(roomCode).emit('round_ended', {
        winner: null,
        character: room.currentCharacter,
        scores: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatarColor: p.avatarColor,
          score: p.score,
          isHost: p.isHost
        }))
      });
    } else {
      io.to(roomCode).emit('player_skipped', {
        playerId: socket.id,
        playerName: player.name,
        skippedCount: room.players.filter(p => p.skipped).length,
        totalCount: room.players.length
      });
    }
  });

  socket.on('return_to_scoreboard', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.host !== socket.id) return;
    room.state = 'lobby';
    room.currentCharacter = null;
    io.to(roomCode).emit('returned_to_scoreboard', { room: sanitizeRoom(room) });
  });

  socket.on('update_profile', ({ roomCode, name, avatarColor }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      if (name !== undefined) player.name = name;
      if (avatarColor !== undefined) player.avatarColor = avatarColor;
      io.to(roomCode).emit('player_updated', { room: sanitizeRoom(room) });
    }
  });

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    const idx = room.players.findIndex(p => p.id === socket.id);
    if (idx === -1) return;

    const wasHost = room.players[idx].isHost;
    room.players.splice(idx, 1);

    if (room.players.length === 0) {
      rooms.delete(roomCode);
      console.log(`Room ${roomCode} closed (empty)`);
      return;
    }

    if (wasHost) {
      room.host = room.players[0].id;
      room.players[0].isHost = true;
    }

    if (room.state === 'playing' && room.players.every(p => p.skipped)) {
      room.state = 'round_end';
      io.to(roomCode).emit('round_ended', {
        winner: null,
        character: room.currentCharacter,
        scores: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatarColor: p.avatarColor,
          score: p.score,
          isHost: p.isHost
        }))
      });
      return;
    }

    io.to(roomCode).emit('player_left', { room: sanitizeRoom(room) });
    console.log(`Player left room ${roomCode}, ${room.players.length} remaining`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎮 Themed Hue's server running at http://localhost:${PORT}`);
});
