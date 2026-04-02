import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import Home from './Home';
import GameRoom from './GameRoom';
import { defaultAvatar } from './data/avatarColors';

const SOCKET_URL = import.meta.env.DEV ? '' : '/';

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
  const [socketReady, setSocketReady] = useState(false);

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

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('themed-hues-profile', JSON.stringify(profile));
  }, [profile]);

  // Initialize socket
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketReady(true);
    });

    socket.on('room_created', ({ roomCode, room }) => {
      setRoom({ ...room, myId: socket.id, isHost: true });
      setGamePhase('lobby');
      setScreen('room');
      setJoinError(null);
    });

    socket.on('room_joined', ({ roomCode, room }) => {
      setRoom({ ...room, myId: socket.id, isHost: false });
      setGamePhase('lobby');
      setScreen('room');
      setJoinError(null);
    });

    socket.on('player_joined', ({ room }) => {
      setRoom(prev => ({ ...room, myId: prev?.myId, isHost: prev?.isHost }));
    });

    socket.on('player_left', ({ room }) => {
      setRoom(prev => {
        if (!prev) return null;
        // Check if I'm now host
        const amHost = room.host === prev.myId;
        return { ...room, myId: prev.myId, isHost: amHost };
      });
    });

    socket.on('player_updated', ({ room }) => {
      setRoom(prev => ({ ...room, myId: prev?.myId, isHost: prev?.isHost }));
    });

    socket.on('round_started', ({ roundNumber, yourColor, totalPlayers, players }) => {
      setMyColor(yourColor);
      setGamePhase('playing');
      setRoundResult(null);
      setWrongGuess(false);
      setSkippedInfo(null);
      setRoom(prev => prev ? { ...prev, state: 'playing', roundNumber } : prev);
    });

    socket.on('round_ended', ({ winner, character, scores }) => {
      setRoundResult({ winner, character, scores });
      setGamePhase('result');
      setRoom(prev => {
        if (!prev) return null;
        const amHost = prev.host === prev.myId;
        return { ...prev, state: 'round_end', players: scores, isHost: amHost };
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

    socket.on('join_error', ({ message }) => {
      setJoinError(message);
    });

    socket.on('disconnect', () => {
      setSocketReady(false);
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

  const returnToScoreboard = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !room) return;
    socket.emit('return_to_scoreboard', { roomCode: room.code });
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
    if (socket) socket.disconnect();
    // Re-connect for future use
    setTimeout(() => {
      const newSocket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
      socketRef.current = newSocket;
      newSocket.on('connect', () => setSocketReady(true));
    }, 100);
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
          profile={profile}
          gamePhase={gamePhase}
          myColor={myColor}
          roundResult={roundResult}
          wrongGuess={wrongGuess}
          skippedInfo={skippedInfo}
          onStartRound={startRound}
          onSubmitGuess={submitGuess}
          onSkipGuess={skipGuess}
          onReturnToScoreboard={returnToScoreboard}
          onUpdateProfile={updateProfile}
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
