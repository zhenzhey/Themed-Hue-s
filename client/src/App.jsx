import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import Home from './Home';
import GameRoom from './GameRoom';
import { defaultAvatar } from './data/avatarColors';

const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:3001' : '/';

function AnimatedBackground() {
  return (
    <div className="bg-blobs">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      <div className="bg-blob bg-blob-4" />
      <div className="bg-blob bg-blob-5" />
    </div>
  );
}

export default function App() {
  const socketRef = useRef(null);
  const [, setSocketReady] = useState(false);

  const [screen, setScreen] = useState('home'); // 'home' | 'room'

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('themed-hues-profile');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return { name: 'Player', avatarColor: defaultAvatar };
  });

  const [room, setRoom] = useState(null);
  const [gamePhase, setGamePhase] = useState('lobby'); // 'lobby' | 'playing' | 'result'
  const [myColor, setMyColor] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [wrongGuess, setWrongGuess] = useState(false);
  const [skippedInfo, setSkippedInfo] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [currentHint, setCurrentHint] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [roundLockedUntil, setRoundLockedUntil] = useState(0);

  // Refs for reconnect logic
  const wasDisconnectedRef = useRef(false);
  const currentRoomRef = useRef(null);
  const profileRef = useRef(profile);

  // Save profile to localStorage and keep ref in sync
  useEffect(() => {
    localStorage.setItem('themed-hues-profile', JSON.stringify(profile));
    profileRef.current = profile;
  }, [profile]);

  // Keep currentRoomRef in sync with room state (for reconnect)
  useEffect(() => {
    currentRoomRef.current = room;
  }, [room]);

  // Initialize socket
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketReady(true);
      // Path 1: same-session reconnect (socket dropped but page is still open)
      if (wasDisconnectedRef.current && currentRoomRef.current) {
        wasDisconnectedRef.current = false;
        socket.emit('rejoin_room', {
          roomCode: currentRoomRef.current.code,
          playerName: profileRef.current.name,
          avatarColor: profileRef.current.avatarColor
        });
        return;
      }
      // Path 2: page refresh — restore from localStorage
      if (!currentRoomRef.current) {
        try {
          const saved = localStorage.getItem('themed-hues-active-room');
          if (saved) {
            const { roomCode } = JSON.parse(saved);
            socket.emit('rejoin_room', {
              roomCode,
              playerName: profileRef.current.name,
              avatarColor: profileRef.current.avatarColor
            });
          }
        } catch {}
      }
    });

    socket.on('room_created', ({ room }) => {
      setRoom({ ...room, myId: socket.id, isHost: true });
      setGamePhase('lobby');
      setScreen('room');
      setJoinError(null);
      localStorage.setItem('themed-hues-active-room', JSON.stringify({ roomCode: room.code }));
    });

    socket.on('room_joined', ({ room }) => {
      setRoom({ ...room, myId: socket.id, isHost: false });
      setGamePhase('lobby');
      setScreen('room');
      setJoinError(null);
      localStorage.setItem('themed-hues-active-room', JSON.stringify({ roomCode: room.code }));
    });

    socket.on('player_joined', ({ room }) => {
      setRoom(prev => ({ ...room, myId: prev?.myId, isHost: prev?.isHost }));
    });

    socket.on('player_left', ({ room }) => {
      setRoom(prev => {
        if (!prev) return null;
        const amHost = room.host === prev.myId;
        const inFrozenPhase = prev.state === 'round_end' || prev.state === 'victory';
        const snapshot = room.leaderboardSnapshot || prev.leaderboardSnapshot || null;
        if (inFrozenPhase && snapshot?.scores?.length) {
          return {
            ...room,
            players: snapshot.scores,
            leaderboardSnapshot: snapshot,
            myId: prev.myId,
            isHost: amHost
          };
        }
        return { ...room, myId: prev.myId, isHost: amHost };
      });
    });

    socket.on('player_updated', ({ room }) => {
      setRoom(prev => ({ ...room, myId: prev?.myId, isHost: prev?.isHost }));
    });

    socket.on('round_started', ({ roundNumber, yourColor, lockedUntil, hintsUsed: myHintsUsed }) => {
      setMyColor(yourColor);
      setGamePhase('playing');
      setRoundResult(null);
      setWrongGuess(false);
      setSkippedInfo(null);
      setCurrentHint(null);
      setHintsUsed(myHintsUsed || 0);
      setRoundLockedUntil(lockedUntil || 0);
      setRoom(prev => prev ? { ...prev, state: 'playing', roundNumber } : prev);
    });

    socket.on('round_ended', ({ winner, character, scores, timestamp }) => {
      setRoundResult({ winner, character, scores, timestamp });
      setGamePhase('result');
      setRoom(prev => {
        if (!prev) return null;
        const amHost = prev.host === prev.myId;
        return {
          ...prev,
          state: 'round_end',
          players: scores,
          leaderboardSnapshot: { timestamp: timestamp || Date.now(), scores },
          isHost: amHost
        };
      });
    });

    socket.on('wrong_guess', () => {
      setWrongGuess(true);
      setTimeout(() => setWrongGuess(false), 600);
    });

    socket.on('player_skipped', ({ playerName, skippedCount, totalCount }) => {
      setSkippedInfo({ playerName, skippedCount, totalCount });
    });

    socket.on('returned_to_scoreboard', ({ room }) => {
      setRoom(prev => {
        if (!prev) return null;
        const amHost = room.host === prev.myId;
        return { ...room, myId: prev.myId, isHost: amHost };
      });
      setGamePhase('lobby');
      setMyColor(null);
      setRoundResult(null);
      setSkippedInfo(null);
    });

    socket.on('hint_revealed', ({ hint }) => {
      setCurrentHint(hint);
    });

    socket.on('hint_count_updated', ({ hintsRemaining }) => {
      setHintsUsed(3 - hintsRemaining);
    });

    socket.on('hint_error', () => {
      // Hint limit reached — already reflected in hintsUsed state
    });

    socket.on('theme_switched', ({ room: updatedRoom }) => {
      setRoom(prev => {
        if (!prev) return null;
        const amHost = updatedRoom.host === prev.myId;
        return { ...updatedRoom, myId: prev.myId, isHost: amHost };
      });
    });

    socket.on('settings_updated', ({ room: updatedRoom }) => {
      setRoom(prev => {
        if (!prev) return null;
        const amHost = updatedRoom.host === prev.myId;
        return { ...updatedRoom, myId: prev.myId, isHost: amHost };
      });
    });

    socket.on('game_ended', ({ scores, timestamp }) => {
      setGamePhase('victory');
      setRoom(prev => prev
        ? {
            ...prev,
            players: scores,
            state: 'victory',
            leaderboardSnapshot: { timestamp: timestamp || Date.now(), scores }
          }
        : prev
      );
    });

    socket.on('rejoined_room', ({ room: updatedRoom, isHost, gamePhase: phase }) => {
      setRoom({ ...updatedRoom, myId: socket.id, isHost });
      setScreen('room');
      localStorage.setItem('themed-hues-active-room', JSON.stringify({ roomCode: updatedRoom.code }));
      if (phase === 'victory') {
        setGamePhase('victory');
      } else if (phase === 'round_end') {
        setGamePhase('result');
      } else if (phase !== 'playing') {
        // If playing, round_started will be emitted separately by server
        setGamePhase('lobby');
        setMyColor(null);
        setRoundResult(null);
      }
    });

    socket.on('rejoin_error', ({ message }) => {
      // Couldn't rejoin (e.g. room expired), go back to home
      localStorage.removeItem('themed-hues-active-room');
      setRoom(null);
      setScreen('home');
      setJoinError(message);
    });

    socket.on('join_error', ({ message }) => {
      setJoinError(message);
    });

    socket.on('disconnect', () => {
      setSocketReady(false);
      if (currentRoomRef.current) {
        wasDisconnectedRef.current = true;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback((theme) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('create_room', {
      theme,
      playerName: profile.name,
      avatarColor: profile.avatarColor
    });
  }, [profile]);

  const joinRoom = useCallback((roomCode) => {
    const socket = socketRef.current;
    if (!socket) return;
    setJoinError(null);
    socket.emit('join_room', {
      roomCode,
      playerName: profile.name,
      avatarColor: profile.avatarColor
    });
  }, [profile]);

  const startRound = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !room) return;
    socket.emit('start_round', { roomCode: room.code });
  }, [room]);

  const submitGuess = useCallback((guess) => {
    const socket = socketRef.current;
    if (!socket || !room) return;
    socket.emit('submit_guess', { roomCode: room.code, guess });
  }, [room]);

  const skipGuess = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !room) return;
    socket.emit('skip_guess', { roomCode: room.code });
  }, [room]);

  const requestHint = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !room) return;
    socket.emit('request_hint', { roomCode: room.code });
    setHintsUsed(prev => Math.min(prev + 1, 3));
  }, [room]);

  const switchTheme = useCallback((theme) => {
    const socket = socketRef.current;
    if (!socket || !room) return;
    socket.emit('switch_theme', { roomCode: room.code, theme });
  }, [room]);

  const updateSettings = useCallback((newSettings) => {
    const socket = socketRef.current;
    if (!socket || !room) return;
    socket.emit('update_settings', { roomCode: room.code, ...newSettings });
  }, [room]);

  const resetGame = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !room) return;
    socket.emit('reset_game', { roomCode: room.code });
  }, [room]);

  const updateProfile = useCallback((updates) => {
    const socket = socketRef.current;
    setProfile(prev => {
      const next = { ...prev, ...updates };
      if (socket && room) {
        socket.emit('update_profile', {
          roomCode: room.code,
          name: next.name,
          avatarColor: next.avatarColor
        });
      }
      return next;
    });
  }, [room]);

  const leaveRoom = useCallback(() => {
    const socket = socketRef.current;
    localStorage.removeItem('themed-hues-active-room');
    wasDisconnectedRef.current = false;
    if (socket) {
      socket.disconnect();
      setTimeout(() => socket.connect(), 100);
    }
    setRoom(null);
    setScreen('home');
    setGamePhase('lobby');
    setMyColor(null);
    setRoundResult(null);
  }, []);

  return (
    <>
      <AnimatedBackground />
      {screen === 'room' && room ? (
        <GameRoom
          room={room}
          gamePhase={gamePhase}
          myColor={myColor}
          roundResult={roundResult}
          wrongGuess={wrongGuess}
          skippedInfo={skippedInfo}
          currentHint={currentHint}
          hintsUsed={hintsUsed}
          roundLockedUntil={roundLockedUntil}
          onStartRound={startRound}
          onSubmitGuess={submitGuess}
          onSkipGuess={skipGuess}
          onRequestHint={requestHint}
          onSwitchTheme={switchTheme}
          onUpdateSettings={updateSettings}
          onResetGame={resetGame}
          onLeave={leaveRoom}
        />
      ) : (
        <Home
          profile={profile}
          joinError={joinError}
          onUpdateProfile={updateProfile}
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          onClearError={() => setJoinError(null)}
        />
      )}
    </>
  );
}
