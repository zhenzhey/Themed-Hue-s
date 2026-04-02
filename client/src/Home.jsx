import { useState } from 'react';
import { avatarColors, defaultAvatar } from './data/avatarColors';
import { themeList } from './data/themes';

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

  return (
    <div className="page" style={{ justifyContent: 'flex-start', paddingTop: 48 }}>
      {/* Logo */}
      <div style={{ marginBottom: 8, textAlign: 'center' }}>
        <div style={{ fontSize: '2.8rem', marginBottom: 6 }}>🎨</div>
        <h1 className="title-logo">Themed Hue's</h1>
        <p className="subtitle">Color Guessing · Party Game</p>
      </div>

      <div style={{ width: '100%', marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>

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
            className="glass"
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
      <div style={{ marginTop: 'auto', paddingTop: 32, textAlign: 'center' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          2–12 players · Requires same network or accessible server
        </p>
      </div>
    </div>
  );
}
