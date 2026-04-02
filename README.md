# Themed Hue's 🎨

A real-time multiplayer color guessing party game. Each player receives a color card on their phone — share what colors you got and race to guess the character first!

## How to Play

1. One player **creates a room** and picks a theme
2. Others **join** using the 4-digit room code
3. Once everyone is in, the host taps **Start Game**
4. Each player's phone shows a full-screen **color card** (e.g. "Golden Yellow", "Warm Brown")
5. Players shout out their colors to each other, then race to type the correct character name
6. **First correct guess wins the round** and gets +1 point
7. Tap **Skip** if you're stuck — when everyone skips, the round ends with no winner
8. The answer is revealed, scores update, and the host starts the next round

## Themes

| Theme | Characters |
|-------|-----------|
| 👸 Disney Princesses | Belle, Cinderella, Ariel, Snow White, Jasmine, Rapunzel, Aurora, Moana, Mulan, Tiana, Elsa, Anna, Merida, Pocahontas |
| 🏰 Classic Disney | Mickey Mouse, Minnie Mouse, Donald Duck, Simba, Dumbo, Bambi |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm run setup
```

### Run (development)

Open two terminals:

```bash
# Terminal 1 — backend server (port 3001)
npm start

# Terminal 2 — frontend (port 5173)
cd client && npm run dev
```

Open `http://localhost:5173` in your browser.

### Local network (same Wi-Fi)

The Vite dev server binds to `0.0.0.0` automatically. Check the terminal for your local IP:

```
➜  Network: http://192.168.x.x:5173/
```

Share that URL with others on the same Wi-Fi.

### Production build

```bash
npm run build:client
NODE_ENV=production npm start
```

The Express server will serve the built client at `http://localhost:3001`.

## Project Structure

```
server.js          # Express + Socket.io server
client/
  src/
    App.jsx        # Root component + all socket event handling
    Home.jsx       # Landing page (profile setup, create/join room)
    GameRoom.jsx   # Lobby, color card, and result views
    data/
      themes.js         # Theme metadata
      avatarColors.js   # 18 gradient avatar colors
    index.css      # Global styles (animated blob background, glass cards)
  vite.config.js
```

## Tech Stack

- **Frontend** — React 18, Vite, plain CSS
- **Backend** — Node.js, Express, Socket.io
- **Real-time** — WebSocket via Socket.io (falls back to polling)
