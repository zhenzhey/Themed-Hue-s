import { useState } from 'react';

const STEPS = [
  {
    stepLabel: 'Step 1',
    title: 'Share Your Clue',
    description: 'All players simultaneously show their phones — your unique color is the clue.',
    illustration: (
      <div className="tut-illus tut-illus-phones">
        {[
          { bg: 'linear-gradient(135deg, #FF6B9D, #FF9A9E)', label: 'Coral' },
          { bg: 'linear-gradient(135deg, #A8EDEA, #74EBD5)', label: 'Mint' },
          { bg: 'linear-gradient(135deg, #FFD89B, #FC9D6D)', label: 'Amber' },
          { bg: 'linear-gradient(135deg, #C79EF8, #9B59B6)', label: 'Violet' },
        ].map((c, i) => (
          <div key={i} className="tut-phone" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="tut-phone-screen" style={{ background: c.bg }}>
              <span className="tut-phone-label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    stepLabel: 'Step 2',
    title: 'Wait for Cooldown',
    description: 'A short countdown prevents instant guessing — take in every color clue.',
    illustration: (
      <div className="tut-illus tut-illus-timer">
        <div className="tut-timer-ring">
          <div className="tut-timer-inner">
            <span className="tut-timer-count">3</span>
            <span className="tut-timer-sub">seconds</span>
          </div>
        </div>
        <div className="tut-color-row">
          {['#FF6B9D','#74EBD5','#FFC96D','#C79EF8'].map((c, i) => (
            <div key={i} className="tut-swatch" style={{ background: c, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    stepLabel: 'Step 3',
    title: 'Guess the Item',
    description: 'Race to type the answer using all color clues — first correct guess wins a point!',
    illustration: (
      <div className="tut-illus tut-illus-guess">
        <div className="tut-guess-box">
          <span className="tut-guess-cursor">Flamingo_</span>
        </div>
        <div className="tut-trophy-row">
          <span className="tut-lightning">⚡</span>
          <span className="tut-trophy">🏆</span>
          <span className="tut-lightning" style={{ animationDelay: '0.3s' }}>⚡</span>
        </div>
        <div className="tut-point-badge">+1 point</div>
      </div>
    ),
  },
];

export default function Tutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    if (isLast) { onClose(); return; }
    setStep(s => s + 1);
  }

  function handleBack() {
    if (step === 0) return;
    setStep(s => s - 1);
  }

  const current = STEPS[step];

  return (
    <div className="modal-overlay tut-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card tut-card fade-in">

        {/* Header */}
        <div className="tut-header">
          <span className="tut-step-pill">{current.stepLabel} of {STEPS.length}</span>
          <button className="tut-close-btn" onClick={onClose} aria-label="Close tutorial">✕</button>
        </div>

        {/* Illustration */}
        <div className="tut-illus-wrap" key={step}>
          {current.illustration}
        </div>

        {/* Text */}
        <div className="tut-text fade-in" key={`text-${step}`}>
          <p className="tut-title">{current.title}</p>
          <p className="tut-desc">{current.description}</p>
        </div>

        {/* Dot indicators */}
        <div className="tut-dots">
          {STEPS.map((_, i) => (
            <button
              key={i}
              className={`tut-dot${i === step ? ' active' : ''}`}
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="tut-nav">
          {step > 0 ? (
            <button className="btn btn-ghost tut-back-btn" onClick={handleBack}>← Back</button>
          ) : (
            <div />
          )}
          <button
            className={`btn ${isLast ? 'btn-primary' : 'btn-secondary'} tut-next-btn`}
            onClick={handleNext}
          >
            {isLast ? "🎮 Let's play!" : 'Next →'}
          </button>
        </div>

      </div>
    </div>
  );
}
