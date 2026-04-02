# Themed Hue's 🎨

A real-time multiplayer color guessing party game. Each player receives a color card on their phone — share what colors you got and race to guess the answer first!

## How to Play

1. One player **creates a room** and picks a theme
2. Others **join** using the 4-digit room code
3. Once everyone is in, the host taps **Start Game**
4. Each player's phone shows a full-screen **color card** (e.g. "Bright Red", "Golden Yellow")
5. Players tell each other their colors, then race to type the correct answer
6. **First correct guess wins the round** and gets +1 point
7. Tap **Skip** if you're stuck — when everyone skips, the round ends with no winner
8. The answer is revealed with scores, and the host starts the next round

Rounds get harder as you play — easier, well-known answers come first.

## Themes

| Theme | Entries |
|-------|---------|
| 🍔 Fast Food | McDonald's, Starbucks, KFC, Subway, Burger King, Taco Bell, Dunkin', In-N-Out, Chipotle, Shake Shack, Domino's |
| 🥤 Drinks & Sodas | Coca-Cola, Pepsi, Sprite, Fanta, Mountain Dew, Dr Pepper, 7UP, Red Bull, Monster |
| 👸 Disney Princesses | Elsa, Anna, Cinderella, Ariel, Belle, Snow White, Jasmine, Rapunzel, Aurora, Moana, Mulan, Tiana, Merida, Pocahontas |
| 🏰 Classic Disney | Mickey Mouse, Minnie Mouse, Simba, Donald Duck, Dumbo, Bambi |

The default theme is whichever appears first in `client/src/data/themes.js`. Reorder that list to change the default.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm run setup
```

### Run

```bash
./start.sh
```

The script kills any existing processes, starts both servers, and prints the URL to open on phones.

Or manually in two terminals:

```bash
# Terminal 1 — backend (port 3001)
npm start

# Terminal 2 — frontend (port 5173)
cd client && npm run dev
```

### Local network (same Wi-Fi)

`start.sh` prints the phone URL automatically. Or check the Vite output for the `Network:` line:

```
➜  Network: http://192.168.x.x:5173/
```

Share that with everyone on the same Wi-Fi.

### Production build

```bash
npm run build:client
NODE_ENV=production npm start
```

The Express server serves the built client at `http://localhost:3001`.

## Adding Themes & Characters

All game data lives in `server.js` at the top in the `themes` object. Each character has:

```js
{
  id: 'mcdonalds',
  difficulty: 1,             // 1 = easy, 2 = medium, 3 = hard (determines round order)
  name: "McDonald's",
  hint: "I'm Lovin' It",
  colors: [
    { name: 'Bright Red', hex: '#DA291C', textColor: '#FFFFFF' },
    { name: 'Golden Yellow', hex: '#FFC72C', textColor: '#7A4A00' }
  ],
  acceptedNames: ["mcdonald's", 'mcdonalds', 'mcd']
}
```

To add a new theme, add it to `themes` in `server.js` and add a matching entry to `client/src/data/themes.js` (for the name, emoji, and description shown in the UI).

## Project Structure

```
start.sh           # One-command launcher
server.js          # Express + Socket.io server + all game data
client/
  src/
    App.jsx        # Root component + all socket event handling
    Home.jsx       # Landing page (profile setup, create/join room)
    GameRoom.jsx   # Lobby, color card, and result views
    data/
      themes.js         # Theme list shown in UI (order = default selection)
      avatarColors.js   # 18 gradient avatar colors
    index.css      # Global styles (animated blob background, glass cards)
  vite.config.js
```

## Tech Stack

- **Frontend** — React 18, Vite, plain CSS
- **Backend** — Node.js, Express, Socket.io
- **Real-time** — WebSocket via Socket.io (falls back to polling)
