import { useState, useEffect, useRef } from 'react';
import { defaultAvatar } from './data/avatarColors';
import { themeList, getThemeName, getThemeEmoji } from './data/themes';

// ─── Shared Helpers ──────────────────────────────────────────────────────────

function Avatar({ avatarColor, name, size = 'md' }) {
  const initial = (name || '?')[0].toUpperCase();
  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: avatarColor?.gradient || defaultAvatar.gradient }}
    >
      {initial}
    </div>
  );
}

// ─── Lobby View ───────────────────────────────────────────────────────────────

function LobbyView({ room, onStartRound, onLeave, onSwitchTheme }) {
  const [copied, setCopied] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  function copyCode() {
    navigator.clipboard?.writeText(room.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page" style={{ justifyContent: 'flex-start', paddingTop: 36 }}>
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={onLeave} style={{ width: 'auto', padding: '8px 14px' }}>
          ← Leave
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {getThemeEmoji(room.theme)} {getThemeName(room.theme)}
          </p>
        </div>
        <div style={{ width: 72 }} />
      </div>

      {/* Room Code */}
      <div className="glass" style={{ padding: '20px 24px', width: '100%', textAlign: 'center', marginBottom: 18 }}>
        <p className="room-code-label">Room Code</p>
        <button onClick={copyCode} style={{ background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer', width: '100%' }}>
          <p className="room-code">{room.code}</p>
        </button>
        <p style={{ fontSize: '0.78rem', color: copied ? 'var(--success)' : 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>
          {copied ? '✓ Copied!' : 'Tap to copy'}
        </p>
      </div>

      {/* Player List */}
      <div className="glass" style={{ padding: '16px', width: '100%', marginBottom: 18 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12, paddingLeft: 4 }}>
          Players ({room.players.length})
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {room.players.map((player, i) => (
            <div key={player.id} className="player-row">
              <span className={`score-rank rank-${i + 1}`}>{i < 3 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}`}</span>
              <Avatar avatarColor={player.avatarColor} name={player.name} size="sm" />
              <span className="player-name">{player.name}</span>
              {player.isHost && <span className="player-badge">Host</span>}
              {player.id === room.myId && <span className="badge-you">You</span>}
              <span className="player-score">{player.score}pt</span>
            </div>
          ))}
        </div>
      </div>

      {/* Theme switcher (host only) */}
      {room.isHost && (
        <div style={{ width: '100%' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowThemePicker(v => !v)}
            style={{ width: '100%', justifyContent: 'center', gap: 6 }}
          >
            🎨 Switch Theme {showThemePicker ? '▲' : '▼'}
          </button>
          {showThemePicker && (
            <div className="glass" style={{ marginTop: 8, padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {themeList.map(t => (
                <button
                  key={t.id}
                  onClick={() => { onSwitchTheme(t.id); setShowThemePicker(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    background: room.theme === t.id ? 'rgba(200,155,232,0.2)' : 'transparent',
                    border: room.theme === t.id ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                    cursor: 'pointer', textAlign: 'left', width: '100%'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{t.emoji}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{t.description}</p>
                  </div>
                  {room.theme === t.id && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontWeight: 700 }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {room.isHost ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {room.players.length < 2 && (
            <div style={{ textAlign: 'center', padding: '8px 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              Waiting for more players (min. 2)
            </div>
          )}
          <button
            className="btn btn-primary"
            onClick={onStartRound}
            disabled={room.players.length < 2}
            style={{ opacity: room.players.length < 2 ? 0.5 : 1 }}
          >
            <span>🎮</span>
            {room.roundNumber > 0 ? 'Next Round' : 'Start Game'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <span className="waiting-dots">Waiting for host to start<span>·</span><span>·</span><span>·</span></span>
        </div>
      )}
    </div>
  );
}

// ─── Playing View (Full-screen Color Card) ────────────────────────────────────

function PlayingView({ myColor, wrongGuess, skippedInfo, onSubmitGuess, onSkipGuess, onRequestHint, currentHint, hintsUsed, roundLockedUntil, room }) {
  const [guess, setGuess] = useState('');
  const [skipped, setSkipped] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef(null);

  const bgColor = myColor?.hex || '#C8A8F8';
  const textColor = myColor?.textColor || '#FFFFFF';
  const locked = countdown > 0;

  function submit() {
    const trimmed = guess.trim();
    if (!trimmed || skipped || locked) return;
    onSubmitGuess(trimmed);
    setGuess('');
  }

  function handleSkip() {
    if (locked) return;
    setSkipped(true);
    onSkipGuess();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') submit();
  }

  // Countdown timer (3s lock at round start)
  useEffect(() => {
    if (!roundLockedUntil) return;
    const tick = () => {
      const remaining = Math.ceil((roundLockedUntil - Date.now()) / 1000);
      setCountdown(remaining > 0 ? remaining : 0);
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [roundLockedUntil]);

  useEffect(() => {
    if (!locked) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [locked]);

  const sparkles = ['✨', '💫', '⭐', '🌟'];
  const randomSparkle = sparkles[Math.floor(bgColor.charCodeAt(1) % sparkles.length)];

  return (
    <div
      className="color-card-page"
      style={{
        background: `linear-gradient(160deg, ${adjustBrightness(bgColor, 20)} 0%, ${bgColor} 50%, ${adjustBrightness(bgColor, -20)} 100%)`
      }}
    >
      {/* 3-second countdown overlay */}
      {locked && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)'
        }}>
          <div style={{ fontSize: '5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{countdown}</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginTop: 12, fontSize: '1rem' }}>Get ready!</p>
        </div>
      )}

      {/* Room code pill (top-left) */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 5,
        padding: '4px 10px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 20,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: textColor, opacity: 0.75, letterSpacing: '0.12em' }}>
          #{room.code}
        </span>
      </div>

      {/* Skip button */}
      {!skipped && !locked && (
        <button className="skip-btn" onClick={handleSkip}>
          Skip esc
        </button>
      )}

      {/* Color display */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 120px', gap: 12 }}>
        <div className="color-card-sparkles">{randomSparkle}</div>

        <div className="color-card-name" style={{ color: textColor }}>
          {myColor?.name || '?'}
        </div>

        <p className="color-card-hint" style={{ color: textColor }}>
          Your color card
        </p>

        <div style={{
          marginTop: 24,
          padding: '8px 18px',
          background: 'rgba(0,0,0,0.12)',
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.25)'
        }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: textColor, opacity: 0.85 }}>
            {room.players?.length || '?'} players · Share colors with each other to guess!
          </p>
        </div>

        {/* Hint area */}
        {currentHint ? (
          <div style={{
            marginTop: 14,
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.18)',
            borderRadius: 20,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: textColor, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Hint</p>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: textColor }}>{currentHint}</p>
          </div>
        ) : !skipped && (
          <button
            onClick={onRequestHint}
            disabled={hintsUsed >= 3}
            style={{
              marginTop: 14,
              padding: '8px 18px',
              background: hintsUsed >= 3 ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.18)',
              borderRadius: 20,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: textColor,
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: hintsUsed >= 3 ? 'not-allowed' : 'pointer',
              opacity: hintsUsed >= 3 ? 0.5 : 1
            }}
          >
            💡 Hint ({3 - hintsUsed} left)
          </button>
        )}

        {skippedInfo && (
          <div style={{
            marginTop: 12,
            padding: '6px 14px',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: 16,
            color: textColor,
            fontSize: '0.8rem',
            fontWeight: 600,
            opacity: 0.8
          }}>
            {skippedInfo.playerName} skipped ({skippedInfo.skippedCount}/{skippedInfo.totalCount})
          </div>
        )}

        {skipped && (
          <div style={{
            marginTop: 16,
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.15)',
            borderRadius: 20,
            color: textColor,
            fontSize: '0.9rem',
            fontWeight: 700,
            opacity: 0.9,
            backdropFilter: 'blur(10px)'
          }}>
            You skipped. Waiting for others<span className="waiting-dots"><span>·</span><span>·</span><span>·</span></span>
          </div>
        )}
      </div>

      {/* Guess input area */}
      {!skipped && (
        <div className="guess-area">
          <input
            ref={inputRef}
            className={`guess-input${wrongGuess ? ' shake' : ''}`}
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your guess…"
            maxLength={40}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={locked}
          />
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '14px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', flexShrink: 0 }}
            onClick={submit}
            disabled={!guess.trim() || locked}
          >
            Guess!
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Round Result View ────────────────────────────────────────────────────────

function ResultView({ roundResult, room, onStartRound, onSwitchTheme }) {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { winner, character, scores } = roundResult;
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="page" style={{ justifyContent: 'flex-start', paddingTop: 36, gap: 14 }}>
      {/* Room code */}
      <div style={{ alignSelf: 'flex-start', padding: '3px 10px', background: 'rgba(255,255,255,0.07)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>#{room.code}</span>
      </div>

      {/* Winner / No winner */}
      <div className="glass fade-in" style={{ padding: '24px 20px', width: '100%', textAlign: 'center' }}>
        {winner ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎉</div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
              First to guess correctly
            </p>
            <p className="result-winner-name">{winner.name}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>+1 point!</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>😅</div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>Nobody guessed this round.</p>
          </>
        )}
      </div>

      {/* Character reveal */}
      <div className="glass fade-in" style={{ padding: '20px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Answer Revealed
        </p>
        <p className="result-character-name">{character.name}</p>
        <p className="result-character-hint">{character.hint}</p>
        <div className="divider" />
        <div className="result-color-chips">
          {character.colors.map((color, i) => (
            <div
              key={i}
              className="result-color-chip"
              style={{ background: color.hex, color: color.textColor }}
            >
              {color.name}
            </div>
          ))}
        </div>
      </div>

      {/* Scoreboard */}
      <div className="glass fade-in" style={{ padding: '16px', width: '100%' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12, paddingLeft: 4 }}>
          Scoreboard
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedScores.map((player, i) => (
            <div key={player.id} className="player-row" style={winner?.id === player.id ? { background: 'rgba(200, 155, 232, 0.15)' } : {}}>
              <span className={`score-rank rank-${i + 1}`}>{i < 3 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}`}</span>
              <Avatar avatarColor={player.avatarColor} name={player.name} size="sm" />
              <span className="player-name">{player.name}</span>
              {player.id === room.myId && <span className="badge-you">You</span>}
              {winner?.id === player.id && <span style={{ fontSize: '1rem' }}>🎉</span>}
              <span className="player-score">{player.score}pt</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ width: '100%', paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {room.isHost ? (
          <>
            <button className="btn btn-primary" onClick={() => onStartRound()}>
              <span>🎮</span> Next Round
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowThemePicker(v => !v)}
              style={{ width: '100%', justifyContent: 'center', gap: 6 }}
            >
              🎨 Switch Theme {showThemePicker ? '▲' : '▼'}
            </button>
            {showThemePicker && (
              <div className="glass" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {themeList.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { onSwitchTheme(t.id); setShowThemePicker(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                      background: room.theme === t.id ? 'rgba(200,155,232,0.2)' : 'transparent',
                      border: room.theme === t.id ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                      cursor: 'pointer', textAlign: 'left', width: '100%'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{t.emoji}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0 }}>{t.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{t.description}</p>
                    </div>
                    {room.theme === t.id && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontWeight: 700 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600, padding: '12px 0' }}>
            <span className="waiting-dots">Waiting for host to start next round<span>·</span><span>·</span><span>·</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function adjustBrightness(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ─── Main GameRoom ────────────────────────────────────────────────────────────

export default function GameRoom({
  room,
  gamePhase,
  myColor,
  roundResult,
  wrongGuess,
  skippedInfo,
  currentHint,
  hintsUsed,
  roundLockedUntil,
  onStartRound,
  onSubmitGuess,
  onSkipGuess,
  onRequestHint,
  onSwitchTheme,
  onLeave
}) {
  if (gamePhase === 'playing' && myColor) {
    return (
      <PlayingView
        myColor={myColor}
        wrongGuess={wrongGuess}
        skippedInfo={skippedInfo}
        currentHint={currentHint}
        hintsUsed={hintsUsed}
        roundLockedUntil={roundLockedUntil}
        onSubmitGuess={onSubmitGuess}
        onSkipGuess={onSkipGuess}
        onRequestHint={onRequestHint}
        room={room}
      />
    );
  }

  if (gamePhase === 'result' && roundResult) {
    return (
      <ResultView
        roundResult={roundResult}
        room={room}
        onStartRound={onStartRound}
        onSwitchTheme={onSwitchTheme}
      />
    );
  }

  return (
    <LobbyView
      room={room}
      onStartRound={onStartRound}
      onSwitchTheme={onSwitchTheme}
      onLeave={onLeave}
    />
  );
}
