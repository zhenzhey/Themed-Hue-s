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

// ─── Settings Modal ───────────────────────────────────────────────────────────

function SettingsModal({ settings, isHost, onSave, onClose }) {
  const [totalRounds, setTotalRounds] = useState(settings?.totalRounds ?? 5);
  const [revealTime,  setRevealTime]  = useState(settings?.revealTime  ?? 3);

  function handleSave() {
    onSave({ totalRounds, revealTime });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div>
          <p className="modal-title">⚙️ Game Settings</p>
        </div>

        {/* Total Rounds */}
        <div>
          <p className="modal-section-label">Total Rounds</p>
          <div className="stepper-row">
            <div className="stepper-label">
              <p className="stepper-label-text">Rounds to Win</p>
              <p className="stepper-label-sub">Game ends after this many rounds</p>
            </div>
            <div className="stepper-controls">
              <button className="stepper-btn" onClick={() => setTotalRounds(v => Math.max(1, v - 1))} disabled={!isHost || totalRounds <= 1}>−</button>
              <div className="stepper-value">{totalRounds}</div>
              <button className="stepper-btn" onClick={() => setTotalRounds(v => Math.min(20, v + 1))} disabled={!isHost || totalRounds >= 20}>+</button>
            </div>
          </div>
        </div>

        {/* Reveal Time */}
        <div>
          <p className="modal-section-label">Color Reveal Time</p>
          <div className="stepper-row">
            <div className="stepper-label">
              <p className="stepper-label-text">Preview Lock</p>
              <p className="stepper-label-sub">Seconds before guessing opens</p>
            </div>
            <div className="stepper-controls">
              <button className="stepper-btn" onClick={() => setRevealTime(v => Math.max(1, v - 1))} disabled={!isHost || revealTime <= 1}>−</button>
              <div className="stepper-value">{revealTime}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '2px' }}>s</span></div>
              <button className="stepper-btn" onClick={() => setRevealTime(v => Math.min(10, v + 1))} disabled={!isHost || revealTime >= 10}>+</button>
            </div>
          </div>
        </div>

        {!isHost && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600 }}>
            Only the host can change settings
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          {isHost && (
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSave}>Save Settings</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Lobby View ───────────────────────────────────────────────────────────────

function LobbyView({ room, onStartRound, onLeave, onSwitchTheme, onUpdateSettings }) {
  const [copied, setCopied] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

      {/* Theme switcher + Settings (host only) */}
      {room.isHost && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowThemePicker(v => !v)}
            style={{ width: '100%', justifyContent: 'flex-start', gap: 6 }}
          >
            🎨 Switch Theme
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {showThemePicker ? '▲' : '▼'}
            </span>
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
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowSettings(true)}
            style={{ width: '100%', justifyContent: 'center', gap: 6 }}
          >
            ⚙️ Game Settings
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {room.settings?.totalRounds ?? 5} rounds · {room.settings?.revealTime ?? 3}s reveal
            </span>
          </button>
        </div>
      )}

      {showSettings && (
        <SettingsModal
          settings={room.settings}
          isHost={room.isHost}
          onSave={onUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
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
            //disabled={room.players.length < 1}
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

        {/* Hint area / Countdown */}
        {locked ? (
          <div style={{
            marginTop: 14,
            fontSize: '5rem', fontWeight: 900, color: textColor,
            lineHeight: 1, opacity: 0.85,
            textShadow: '0 2px 16px rgba(0,0,0,0.2)'
          }}>
            {countdown}
          </div>
        ) : currentHint ? (
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
            placeholder={locked ? 'Get ready…' : 'Type your guess…'}
            maxLength={40}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={locked}
            style={locked ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          />
          <button
            className="btn btn-primary"
            style={{
              width: 'auto',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              flexShrink: 0,
              opacity: locked ? 0.4 : 1,
              backgroundColor: locked ? '#999999' : undefined,
              cursor: locked ? 'not-allowed' : undefined
            }}
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

// ─── Victory View ─────────────────────────────────────────────────────────────

const CONFETTI = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎀'];

function VictoryView({ room, onResetGame, onLeave }) {
  const sorted = [...room.players].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...sorted.map(p => p.score), 1);
  const champion = sorted[0];
  const isWinner = champion?.id === room.myId;

  // Generate stable confetti pieces
  const confettiPieces = isWinner ? Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: CONFETTI[i % CONFETTI.length],
    left: `${(i * 5.5 + 3) % 100}%`,
    delay: `${(i * 0.18) % 2}s`,
    duration: `${2.2 + (i % 5) * 0.4}s`,
  })) : [];

  return (
    <div className="page" style={{ justifyContent: 'flex-start', paddingTop: 40, gap: 16 }}>

      {/* Confetti overlay (winner only) */}
      {isWinner && (
        <div className="confetti-container">
          {confettiPieces.map(p => (
            <span
              key={p.id}
              className="confetti-piece"
              style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      {/* Trophy + Title */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div className="victory-trophy">{isWinner ? '🏆' : '🎮'}</div>
        <p className="victory-title">{isWinner ? 'You Win!' : 'Nice Try!'}</p>
        <p className="victory-subtitle">
          {room.settings?.totalRounds ?? 5} rounds complete
        </p>
      </div>

      {/* Champion banner */}
      {champion && (
        <div className="victory-champion-banner">
          <div className="victory-champion-emoji">🥇</div>
          <div>
            <p className="victory-champion-label">Champion</p>
            <p className="victory-champion-name">{champion.name}</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#5A3E00', lineHeight: 1 }}>{champion.score}</p>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8B6200' }}>points</p>
          </div>
        </div>
      )}

      {/* Final Standings */}
      <div className="glass fade-in" style={{ padding: '16px', width: '100%' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12, paddingLeft: 4 }}>
          Final Standings
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((player, i) => (
            <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={`score-rank rank-${i + 1}`} style={{ minWidth: 28 }}>
                {i < 3 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}`}
              </span>
              <Avatar avatarColor={player.avatarColor} name={player.name} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span className="player-name" style={{ fontSize: '0.88rem' }}>{player.name}</span>
                  {player.id === room.myId && <span className="badge-you">You</span>}
                </div>
                <div className="score-bar-track">
                  <div
                    className={`score-bar-fill rank-${i + 1}`}
                    style={{ width: `${Math.max(4, (player.score / maxScore) * 100)}%` }}
                  />
                </div>
              </div>
              <span className="player-score" style={{ minWidth: 40, textAlign: 'right' }}>{player.score}pt</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
        {room.isHost && (
          <button className="btn btn-primary" onClick={onResetGame}>
            <span>🔄</span> Play Again
          </button>
        )}
        <button className="btn btn-ghost" onClick={onLeave}>
          Leave Room
        </button>
        {!room.isHost && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, paddingTop: 4 }}>
            <span className="waiting-dots">Waiting for host<span>·</span><span>·</span><span>·</span></span>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Round Result View ────────────────────────────────────────────────────────

function ResultView({ roundResult, room, onStartRound, onSwitchTheme, onEndGame }) {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { winner, character, scores } = roundResult;
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const totalRounds = room.settings?.totalRounds ?? 5;
  const isGameOver = room.roundNumber >= totalRounds;

  return (
    <div className="page" style={{ justifyContent: 'flex-start', paddingTop: 36, gap: 14 }}>

      {/* Top row: room code + theme icon */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.07)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>#{room.code}</span>
        </div>
        {room.isHost && !isGameOver && (
          <button
            onClick={() => setShowThemePicker(true)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.55)',
              border: '1.5px solid rgba(255,255,255,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(160,120,180,0.1)',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            title="Switch Theme"
          >
            🎨
          </button>
        )}
      </div>

      {/* Round progress */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="score-bar-track" style={{ flex: 1 }}>
          <div
            className="score-bar-fill"
            style={{ width: `${(room.roundNumber / totalRounds) * 100}%`, background: isGameOver ? 'linear-gradient(90deg, #FFD700, #F5C842)' : undefined }}
          />
        </div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isGameOver ? 'var(--accent-deep)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {isGameOver ? 'Final Round!' : `Round ${room.roundNumber} / ${totalRounds}`}
        </span>
      </div>

      {/* Theme picker popup */}
      {showThemePicker && (
        <div className="modal-overlay" onClick={() => setShowThemePicker(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p className="modal-title">🎨 Switch Theme</p>
              {/* <button
                onClick={() => setShowThemePicker(false)}
                style={{ background: 'rgba(200,155,232,0.15)', border: '1.5px solid rgba(200,155,232,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Done
              </button> */}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {themeList.map(t => (
                <button
                  key={t.id}
                  onClick={() => { onSwitchTheme(t.id); setShowThemePicker(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    background: room.theme === t.id ? 'linear-gradient(135deg, #C879E8, #9B59B6)' : 'rgba(255,255,255,0.45)',
                    border: room.theme === t.id ? '2px solid #9B59B6' : '1.5px solid transparent',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{t.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: room.theme === t.id ? '#fff' : 'var(--text-primary)', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '0.75rem', color: room.theme === t.id ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)', margin: 0 }}>{t.description}</p>
                  </div>
                  {room.theme === t.id && <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
            <div key={i} className="result-color-chip" style={{ background: color.hex, color: color.textColor }}>
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
          isGameOver ? (
            <button className="btn btn-primary" onClick={onEndGame}>
              <span>🏆</span> See Final Results
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => onStartRound()}>
              <span>🎮</span> Next Round
            </button>
          )
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600, padding: '12px 0' }}>
            {isGameOver
              ? <span>Game over! Waiting for host<span className="waiting-dots"><span>·</span><span>·</span><span>·</span></span></span>
              : <span className="waiting-dots">Waiting for host to start next round<span>·</span><span>·</span><span>·</span></span>
            }
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
  onUpdateSettings,
  onEndGame,
  onResetGame,
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

  if (gamePhase === 'victory') {
    return (
      <VictoryView
        room={room}
        onResetGame={onResetGame}
        onLeave={onLeave}
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
        onEndGame={onEndGame}
      />
    );
  }

  return (
    <LobbyView
      room={room}
      onStartRound={onStartRound}
      onSwitchTheme={onSwitchTheme}
      onUpdateSettings={onUpdateSettings}
      onLeave={onLeave}
    />
  );
}
