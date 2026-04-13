import { useEffect, useRef, useState } from 'react';
import { avatarColors, defaultAvatar } from './data/avatarColors';
import { themeList } from './data/themes';
import Tutorial from './Tutorial';

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

export default function Home({ profile, joinError, onUpdateProfile, onCreateRoom, onJoinRoom, onClearError }) {
  const [view, setView] = useState('main'); // 'main' | 'create' | 'join' | 'editProfile'
  const [isMainIntroActive, setIsMainIntroActive] = useState(true);
  const hasPlayedMainIntro = useRef(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const [processedLogoSrc, setProcessedLogoSrc] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(themeList[0].id);
  const [joinCode, setJoinCode] = useState('');
  const [editName, setEditName] = useState(profile.name);
  const [editColor, setEditColor] = useState(profile.avatarColor || defaultAvatar);

  function handleCreate() {
    if (view !== 'create') { setView('create'); return; }
    onCreateRoom(selectedTheme);
  }

  function handleJoin() {
    if (view !== 'join') { setView('join'); return; }
    const code = joinCode.trim();
    if (code.length < 4) return;
    onJoinRoom(code);
  }

  function handleSaveProfile() {
    onUpdateProfile({ name: editName.trim() || 'Player', avatarColor: editColor });
    setView('main');
  }

  useEffect(() => {
    if (hasPlayedMainIntro.current) {
      setIsMainIntroActive(false);
      return;
    }

    const timer = setTimeout(() => {
      hasPlayedMainIntro.current = true;
      setIsMainIntroActive(false);
    }, 1250);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/title-logo.png';

    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Sample corners as probable background color.
        const corners = [
          [0, 0],
          [canvas.width - 1, 0],
          [0, canvas.height - 1],
          [canvas.width - 1, canvas.height - 1],
        ];
        let bgR = 0;
        let bgG = 0;
        let bgB = 0;
        corners.forEach(([x, y]) => {
          const i = (y * canvas.width + x) * 4;
          bgR += data[i];
          bgG += data[i + 1];
          bgB += data[i + 2];
        });
        bgR = Math.round(bgR / corners.length);
        bgG = Math.round(bgG / corners.length);
        bgB = Math.round(bgB / corners.length);

        const tolerance = 34;
        for (let i = 0; i < data.length; i += 4) {
          const dr = Math.abs(data[i] - bgR);
          const dg = Math.abs(data[i + 1] - bgG);
          const db = Math.abs(data[i + 2] - bgB);
          if (dr <= tolerance && dg <= tolerance && db <= tolerance) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedLogoSrc(canvas.toDataURL('image/png'));
        setLogoLoadFailed(false);
      } catch {
        setProcessedLogoSrc(null);
      }
    };

    img.onerror = () => {
      if (cancelled) return;
      setProcessedLogoSrc(null);
      setLogoLoadFailed(true);
    };

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={`page home-page${isMainIntroActive && view === 'main' ? ' home-page-intro' : ''}`} style={{ minHeight: '100dvh' }}>
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}

      {/* Logo */}
      <div className={`home-logo-block${isMainIntroActive && view === 'main' ? ' home-logo-center home-logo-pop' : ' home-logo-top'}`}>
        {!logoLoadFailed ? (
          <img
            src={processedLogoSrc || '/title-logo.png'}
            alt="Themed Hue's"
            className="title-logo-image"
            loading="eager"
            decoding="async"
            onError={() => setLogoLoadFailed(true)}
          />
        ) : (
          <h1 className="title-logo">Themed Hue's</h1>
        )}
        <p className="subtitle">Color Guessing · Party Game</p>
      </div>

      <div className={`home-main-stack${isMainIntroActive && view === 'main' ? ' home-content-hold' : ''}`}>

        {/* Profile Card */}
        {view === 'editProfile' ? (
          <div className="glass fade-in" style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Edit Profile
            </p>

            {/* Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
              <Avatar avatarColor={editColor} name={editName || '?'} size="lg" />
              <div>
                <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{editName || 'Player'}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{editColor.name}</p>
              </div>
            </div>

            {/* Name input */}
            <input
              className="input-field"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Enter your name"
              maxLength={16}
            />

            {/* Color picker */}
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Choose avatar color</p>
              <div className="color-picker-grid">
                {avatarColors.map(color => (
                  <button
                    key={color.id}
                    className={`color-swatch${editColor.id === color.id ? ' selected' : ''}`}
                    onClick={() => setEditColor(color)}
                    title={color.name}
                  >
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: color.gradient }} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setView('main')}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSaveProfile}>Save</button>
            </div>
          </div>
        ) : (
          <button
            className={view === 'main' && !isMainIntroActive ? 'glass home-reveal home-reveal-2' : 'glass'}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 'var(--radius-lg)', width: '100%', textAlign: 'left', cursor: 'pointer', border: '1.5px solid rgba(255,255,255,0.8)' }}
            onClick={() => { setEditName(profile.name); setEditColor(profile.avatarColor || defaultAvatar); setView('editProfile'); }}
          >
            <Avatar avatarColor={profile.avatarColor} name={profile.name} size="md" />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{profile.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>Tap to edit profile</p>
            </div>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>✏️</span>
          </button>
        )}

        {view !== 'editProfile' && (
          <>
            {/* Create Room */}
            {view === 'create' && (
              <div className="glass fade-in" style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Choose Theme
                </p>
                {themeList.map(theme => (
                  <button
                    key={theme.id}
                    className={`theme-card${selectedTheme === theme.id ? ' selected' : ''}`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <span className="theme-emoji">{theme.emoji}</span>
                    <div className="theme-info">
                      <p className="theme-name">{theme.name}</p>
                      <p className="theme-desc">{theme.description}</p>
                    </div>
                    {selectedTheme === theme.id && (
                      <span style={{ color: 'var(--accent-deep)', fontSize: '1.1rem' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Join Room */}
            {view === 'join' && (
              <div className="glass fade-in" style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Join a Room
                </p>
                <input
                  className="input-field"
                  value={joinCode}
                  onChange={e => { setJoinCode(e.target.value.replace(/\D/g, '')); onClearError(); }}
                  placeholder="Enter 4-digit room code"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.3em' }}
                  autoFocus
                />
                {joinError && <p className="error-msg">{joinError}</p>}
              </div>
            )}

            <div
              className={view === 'main' && !isMainIntroActive ? 'home-reveal home-reveal-3' : ''}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <button
                className={`btn ${view === 'create' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleCreate}
              >
                <span>🏠</span>
                {view === 'create' ? 'Confirm & Create Room' : 'Create Room'}
              </button>

              <button
                className={`btn ${view === 'join' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleJoin}
              >
                <span>🚪</span>
                {view === 'join' ? 'Join Room' : 'Join a Room'}
              </button>

              {(view === 'create' || view === 'join') && (
                <button
                  className="btn btn-ghost"
                  onClick={() => { setView('main'); onClearError(); setJoinCode(''); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        className={view === 'main' && !isMainIntroActive ? 'home-reveal home-reveal-4' : ''}
        style={{ marginTop: 'auto', paddingTop: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
      >
        <button className="tut-trigger-btn" onClick={() => setShowTutorial(true)}>
          ❓ How to Play
        </button>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          2–12 players · Requires same network or accessible server
        </p>
      </div>
    </div>
  );
}
