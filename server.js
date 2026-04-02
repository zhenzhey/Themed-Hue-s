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
// difficulty: 1 = easy/famous, 2 = medium, 3 = hard

const themes = {
  disney_princess: {
    id: 'disney_princess',
    name: 'Disney Princesses',
    emoji: '👸',
    characters: [
      {
        id: 'elsa', difficulty: 1,
        name: 'Elsa', hint: 'Frozen',
        colors: [
          { name: 'Ice Blue', hex: '#74B9FF', textColor: '#FFFFFF' },
          { name: 'Snow White', hex: '#DFE6E9', textColor: '#4A5568' }
        ],
        acceptedNames: ['elsa', 'frozen elsa', 'ice queen']
      },
      {
        id: 'anna', difficulty: 1,
        name: 'Anna', hint: 'Frozen',
        colors: [
          { name: 'Sky Blue', hex: '#0984E3', textColor: '#FFFFFF' },
          { name: 'Chestnut Brown', hex: '#8B5E3C', textColor: '#FFE4A0' }
        ],
        acceptedNames: ['anna', 'frozen anna', 'princess anna']
      },
      {
        id: 'cinderella', difficulty: 1,
        name: 'Cinderella', hint: 'Cinderella',
        colors: [
          { name: 'Sky Blue', hex: '#87CEEB', textColor: '#1A5C80' },
          { name: 'Silver', hex: '#B8B8C8', textColor: '#3A3A4A' }
        ],
        acceptedNames: ['cinderella', 'cindy', 'ella']
      },
      {
        id: 'ariel', difficulty: 1,
        name: 'Ariel', hint: 'The Little Mermaid',
        colors: [
          { name: 'Fiery Red', hex: '#E8403C', textColor: '#FFFFFF' },
          { name: 'Sea Teal', hex: '#2BC0B4', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['ariel', 'the little mermaid', 'little mermaid']
      },
      {
        id: 'moana', difficulty: 1,
        name: 'Moana', hint: 'Moana',
        colors: [
          { name: 'Coral Red', hex: '#E8484C', textColor: '#FFFFFF' },
          { name: 'Warm Orange', hex: '#FF8C42', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['moana', 'vaiana']
      },
      {
        id: 'mulan', difficulty: 1,
        name: 'Mulan', hint: 'Mulan',
        colors: [
          { name: 'Dusty Rose', hex: '#FF6B8A', textColor: '#FFFFFF' },
          { name: 'Copper Gold', hex: '#D4AF37', textColor: '#5A3E00' }
        ],
        acceptedNames: ['mulan', 'hua mulan', 'fa mulan']
      },
      {
        id: 'belle', difficulty: 1,
        name: 'Belle', hint: 'Beauty and the Beast',
        colors: [
          { name: 'Golden Yellow', hex: '#F5C842', textColor: '#7A5C00' },
          { name: 'Warm Brown', hex: '#8B5E3C', textColor: '#FFE4A0' }
        ],
        acceptedNames: ['belle', 'beauty', 'beauty and the beast']
      },
      {
        id: 'snow_white', difficulty: 1,
        name: 'Snow White', hint: 'Snow White and the Seven Dwarfs',
        colors: [
          { name: 'Crimson Red', hex: '#C41E3A', textColor: '#FFFFFF' },
          { name: 'Royal Blue', hex: '#2445AB', textColor: '#FFFFFF' },
          { name: 'Pale Yellow', hex: '#F5D800', textColor: '#7A5C00' }
        ],
        acceptedNames: ['snow white', 'snowwhite', 'snow']
      },
      {
        id: 'jasmine', difficulty: 2,
        name: 'Jasmine', hint: 'Aladdin',
        colors: [
          { name: 'Teal', hex: '#20B2AA', textColor: '#FFFFFF' },
          { name: 'Deep Purple', hex: '#6A3D9A', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['jasmine', 'aladdin princess', 'princess jasmine']
      },
      {
        id: 'rapunzel', difficulty: 2,
        name: 'Rapunzel', hint: 'Tangled',
        colors: [
          { name: 'Lilac Purple', hex: '#9B59B6', textColor: '#FFFFFF' },
          { name: 'Blush Pink', hex: '#FF85A1', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['rapunzel', 'tangled', 'pascal']
      },
      {
        id: 'aurora', difficulty: 2,
        name: 'Aurora', hint: 'Sleeping Beauty',
        colors: [
          { name: 'Rose Pink', hex: '#FF9EB5', textColor: '#6B1F35' },
          { name: 'Royal Blue', hex: '#3A5FCD', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['aurora', 'sleeping beauty', 'briar rose']
      },
      {
        id: 'tiana', difficulty: 2,
        name: 'Tiana', hint: 'The Princess and the Frog',
        colors: [
          { name: 'Emerald Green', hex: '#27AE60', textColor: '#FFFFFF' },
          { name: 'Warm Gold', hex: '#F39C12', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['tiana', 'princess and the frog', 'princess tiana']
      },
      {
        id: 'merida', difficulty: 3,
        name: 'Merida', hint: 'Brave',
        colors: [
          { name: 'Flame Orange', hex: '#E17055', textColor: '#FFFFFF' },
          { name: 'Forest Green', hex: '#00695C', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['merida', 'brave', 'princess merida']
      },
      {
        id: 'pocahontas', difficulty: 3,
        name: 'Pocahontas', hint: 'Pocahontas',
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
        id: 'mickey', difficulty: 1,
        name: 'Mickey Mouse', hint: 'Mickey Mouse Clubhouse',
        colors: [
          { name: 'Black', hex: '#2D2D2D', textColor: '#FFFFFF' },
          { name: 'Bright Red', hex: '#D32F2F', textColor: '#FFFFFF' },
          { name: 'Yellow', hex: '#FDD835', textColor: '#5A4000' }
        ],
        acceptedNames: ['mickey', 'mickey mouse', 'mouse']
      },
      {
        id: 'minnie', difficulty: 1,
        name: 'Minnie Mouse', hint: "Minnie's Bow-Toons",
        colors: [
          { name: 'Black', hex: '#2D2D2D', textColor: '#FFFFFF' },
          { name: 'Hot Pink', hex: '#E91E63', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['minnie', 'minnie mouse']
      },
      {
        id: 'simba', difficulty: 1,
        name: 'Simba', hint: 'The Lion King',
        colors: [
          { name: 'Orange Gold', hex: '#FF8F00', textColor: '#FFFFFF' },
          { name: 'Brown', hex: '#6D4C41', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['simba', 'lion king', 'the lion king']
      },
      {
        id: 'donald', difficulty: 2,
        name: 'Donald Duck', hint: 'Donald Duck',
        colors: [
          { name: 'Cobalt Blue', hex: '#1565C0', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['donald', 'donald duck', 'duck']
      },
      {
        id: 'dumbo', difficulty: 2,
        name: 'Dumbo', hint: 'Dumbo',
        colors: [
          { name: 'Blue Gray', hex: '#90A4AE', textColor: '#FFFFFF' },
          { name: 'Light Pink', hex: '#F48FB1', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['dumbo', 'flying elephant', 'jumbo']
      },
      {
        id: 'bambi', difficulty: 3,
        name: 'Bambi', hint: 'Bambi',
        colors: [
          { name: 'Light Tan', hex: '#D2A679', textColor: '#5A3A00' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['bambi', 'little deer', 'deer']
      }
    ]
  },
  fast_food: {
    id: 'fast_food',
    name: 'Fast Food',
    emoji: '🍔',
    characters: [
      {
        id: 'mcdonalds', difficulty: 1,
        name: "McDonald's", hint: "I'm Lovin' It",
        colors: [
          { name: 'Bright Red', hex: '#DA291C', textColor: '#FFFFFF' },
          { name: 'Golden Yellow', hex: '#FFC72C', textColor: '#7A4A00' }
        ],
        acceptedNames: ["mcdonald's", 'mcdonalds', 'mcd', 'mc donalds', 'micky d', 'golden arches']
      },
      {
        id: 'starbucks', difficulty: 1,
        name: 'Starbucks', hint: 'Coffee & More',
        colors: [
          { name: 'Forest Green', hex: '#00704A', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['starbucks', 'starbuck']
      },
      {
        id: 'kfc', difficulty: 1,
        name: 'KFC', hint: "Kentucky Fried Chicken",
        colors: [
          { name: 'Bright Red', hex: '#F40027', textColor: '#FFFFFF' },
          { name: 'Cream White', hex: '#F5F0E8', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['kfc', 'kentucky fried chicken', 'kentucky']
      },
      {
        id: 'subway', difficulty: 1,
        name: 'Subway', hint: 'Eat Fresh',
        colors: [
          { name: 'Forest Green', hex: '#008C15', textColor: '#FFFFFF' },
          { name: 'Bright Yellow', hex: '#FFC600', textColor: '#5A4000' }
        ],
        acceptedNames: ['subway', 'sub']
      },
      {
        id: 'burger_king', difficulty: 2,
        name: 'Burger King', hint: 'Have it your way',
        colors: [
          { name: 'Bright Red', hex: '#D62300', textColor: '#FFFFFF' },
          { name: 'Golden Yellow', hex: '#F5A800', textColor: '#5A3A00' },
          { name: 'Royal Blue', hex: '#003594', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['burger king', 'bk', 'burgerking']
      },
      {
        id: 'taco_bell', difficulty: 2,
        name: 'Taco Bell', hint: 'Live Más',
        colors: [
          { name: 'Purple', hex: '#702082', textColor: '#FFFFFF' },
          { name: 'Hot Pink', hex: '#EE3895', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['taco bell', 'tacobell', 'taco']
      },
      {
        id: 'dunkin', difficulty: 2,
        name: "Dunkin'", hint: 'America Runs on Dunkin',
        colors: [
          { name: 'Bright Orange', hex: '#FF671F', textColor: '#FFFFFF' },
          { name: 'Hot Pink', hex: '#DA1884', textColor: '#FFFFFF' }
        ],
        acceptedNames: ["dunkin'", 'dunkin', "dunkin donuts", "dunkin' donuts", 'dd']
      },
      {
        id: 'in_n_out', difficulty: 2,
        name: 'In-N-Out', hint: 'West Coast Burgers',
        colors: [
          { name: 'Bright Red', hex: '#CC2529', textColor: '#FFFFFF' },
          { name: 'Bright Yellow', hex: '#F8D000', textColor: '#5A4000' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['in-n-out', 'in and out', 'in n out', 'innout']
      },
      {
        id: 'chipotle', difficulty: 3,
        name: 'Chipotle', hint: 'Mexican Grill',
        colors: [
          { name: 'Earthy Brown', hex: '#441500', textColor: '#FFD09B' },
          { name: 'Terracotta', hex: '#A2320F', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['chipotle', 'chipotle mexican grill']
      },
      {
        id: 'shake_shack', difficulty: 3,
        name: 'Shake Shack', hint: 'Stand for Something Good',
        colors: [
          { name: 'Forest Green', hex: '#3D7A3A', textColor: '#FFFFFF' },
          { name: 'Cream White', hex: '#F5F0E0', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['shake shack', 'shakeshack', 'shack']
      },
      {
        id: 'dominos', difficulty: 3,
        name: "Domino's", hint: 'Pizza Delivery',
        colors: [
          { name: 'Deep Blue', hex: '#006491', textColor: '#FFFFFF' },
          { name: 'Bright Red', hex: '#E31837', textColor: '#FFFFFF' }
        ],
        acceptedNames: ["domino's", 'dominos', 'domino']
      }
    ]
  },
  drinks: {
    id: 'drinks',
    name: 'Drinks & Sodas',
    emoji: '🥤',
    characters: [
      {
        id: 'coca_cola', difficulty: 1,
        name: 'Coca-Cola', hint: 'The Real Thing',
        colors: [
          { name: 'Bright Red', hex: '#F40009', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['coca-cola', 'coca cola', 'coke', 'cola']
      },
      {
        id: 'pepsi', difficulty: 1,
        name: 'Pepsi', hint: "That's What I Like",
        colors: [
          { name: 'Royal Blue', hex: '#004B93', textColor: '#FFFFFF' },
          { name: 'Bright Red', hex: '#ED1C24', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['pepsi', 'pepsi cola']
      },
      {
        id: 'sprite', difficulty: 1,
        name: 'Sprite', hint: 'Lymon Taste',
        colors: [
          { name: 'Lime Green', hex: '#00A74A', textColor: '#FFFFFF' },
          { name: 'Bright Yellow', hex: '#FFD700', textColor: '#5A4000' }
        ],
        acceptedNames: ['sprite', 'sprite soda']
      },
      {
        id: 'fanta', difficulty: 1,
        name: 'Fanta', hint: 'Wanta Fanta',
        colors: [
          { name: 'Bright Orange', hex: '#F7941D', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['fanta', 'fanta orange']
      },
      {
        id: 'mountain_dew', difficulty: 2,
        name: 'Mountain Dew', hint: 'Do the Dew',
        colors: [
          { name: 'Electric Green', hex: '#97D700', textColor: '#3A5500' },
          { name: 'Deep Green', hex: '#1A5C00', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['mountain dew', 'mtn dew', 'dew', 'mountaindew']
      },
      {
        id: 'dr_pepper', difficulty: 2,
        name: 'Dr Pepper', hint: '23 Flavors',
        colors: [
          { name: 'Deep Maroon', hex: '#8B0000', textColor: '#FFFFFF' },
          { name: 'Silver', hex: '#C0C0C0', textColor: '#3A3A3A' }
        ],
        acceptedNames: ['dr pepper', 'dr. pepper', 'drpepper', 'doctor pepper']
      },
      {
        id: '7up', difficulty: 2,
        name: '7UP', hint: 'Make 7UP Yours',
        colors: [
          { name: 'Bright Green', hex: '#00A651', textColor: '#FFFFFF' },
          { name: 'Red Dot', hex: '#ED1C24', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['7up', '7-up', 'seven up', 'sevenup']
      },
      {
        id: 'red_bull', difficulty: 3,
        name: 'Red Bull', hint: 'Gives You Wings',
        colors: [
          { name: 'Cobalt Blue', hex: '#1E3E7B', textColor: '#FFFFFF' },
          { name: 'Silver', hex: '#C0C0C0', textColor: '#3A3A3A' },
          { name: 'Bright Red', hex: '#CC0000', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['red bull', 'redbull']
      },
      {
        id: 'monster', difficulty: 3,
        name: 'Monster', hint: 'Unleash the Beast',
        colors: [
          { name: 'Black', hex: '#1A1A1A', textColor: '#FFFFFF' },
          { name: 'Neon Green', hex: '#7AB800', textColor: '#1A1A1A' }
        ],
        acceptedNames: ['monster', 'monster energy']
      }
    ]
  }
};

// ─── Room Management ──────────────────────────────────────────────────────────

const rooms = new Map();

function generateRoomCode() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

function pickCharacter(room, themeData) {
  let unused = themeData.characters.filter(c => !room.usedCharacterIds.has(c.id));
  if (unused.length === 0) {
    room.usedCharacterIds.clear();
    unused = [...themeData.characters];
  }
  // Pick lowest difficulty first; randomize within same tier
  const minDiff = Math.min(...unused.map(c => c.difficulty));
  const candidates = unused.filter(c => c.difficulty === minDiff);
  return candidates[Math.floor(Math.random() * candidates.length)];
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
      roundNumber: 0,
      usedCharacterIds: new Set()
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
    // Allow starting from lobby or round_end (skips scoreboard screen)
    if (room.state !== 'lobby' && room.state !== 'round_end') return;

    const themeData = themes[room.theme];
    if (!themeData || themeData.characters.length === 0) return;

    const char = pickCharacter(room, themeData);
    room.usedCharacterIds.add(char.id);
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

    console.log(`Round ${room.roundNumber} started in ${roomCode}: ${char.name} (difficulty ${char.difficulty})`);
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
