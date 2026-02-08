import React, { useState, useCallback, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import HTMLFlipBook from "react-pageflip";
import { useConfig } from "./useConfig";
import { SettingsPanel } from "./SettingsPanel";
import "./App.css";

const getPhotoSrc = (photo) =>
  typeof photo === "string" && photo.startsWith("data:") ? photo : `/photos/${photo}`;

const Page = React.forwardRef(({ photo, caption }, ref) => (
  <div className="flip-page" ref={ref}>
    <div className="flip-page-content">
      <div className="flip-page-img-wrap">
        <img src={getPhotoSrc(photo)} alt={caption} className="flip-page-img" />
      </div>
      <p className="flip-page-caption">{caption}</p>
    </div>
  </div>
));

const FLOATING_HEARTS = ["❤️", "💕", "💗", "💖", "💝", "❤️", "💕", "💗", "💖", "💝"];

function App() {
  const { config, saveConfig, resetConfig } = useConfig();
  const [showSettings, setShowSettings] = useState(false);

  const LETTER_LINES = config.letterLines || [];
  const REASONS = config.reasons || [];
  const PHOTOS = config.photos || [];
  const PHOTO_CAPTIONS = config.photoCaptions || [];
  const SONG_PATH = config.songPath || "/songs/love-song.mp3";
  const [step, setStep] = useState("landing");
  const [letterLineIndex, setLetterLineIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 55, y: 55 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  const flipbookSize = windowSize.width <= 480
    ? { width: Math.min(300, windowSize.width - 32), height: 420 }
    : windowSize.width <= 600
      ? { width: 340, height: 460 }
      : { width: 380, height: 520 };
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [albumPhotoIndex, setAlbumPhotoIndex] = useState(0);
  const initialPageRef = useRef(0);
  const bookRef = useRef(null);
  const audioRef = useRef(null);

  const openAlbum = useCallback((index) => {
    initialPageRef.current = index;
    setAlbumPhotoIndex(index);
    setAlbumOpen(true);
  }, []);

  const closeAlbum = useCallback(() => setAlbumOpen(false), []);

  const handleBookInit = useCallback(() => {
    const page = initialPageRef.current;
    if (bookRef.current?.pageFlip && page > 0) {
      bookRef.current.pageFlip().turnToPage(page);
    }
  }, []);

  const goToPrevPhoto = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flipPrev();
  }, []);

  const goToNextPhoto = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flipNext();
  }, []);

  const handleFlip = useCallback((e) => {
    setAlbumPhotoIndex(e.data);
  }, []);

  const playMusic = useCallback(() => {
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  }, [isMusicPlaying]);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  }, [isMusicPlaying]);

  const runAway = useCallback(() => {
    setNoButtonPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 75 + 12,
    });
  }, []);

  const handleYes = useCallback(() => {
    playMusic();
    setShowConfetti(true);
    setStep("success");
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    const t = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(t);
  }, [playMusic]);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!albumOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeAlbum();
      if (e.key === "ArrowLeft") goToPrevPhoto();
      if (e.key === "ArrowRight") goToNextPhoto();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [albumOpen, closeAlbum, goToPrevPhoto, goToNextPhoto]);

  useEffect(() => {
    if (step !== "letter") return;
    if (letterLineIndex >= LETTER_LINES.length) return;
    const t = setTimeout(
      () => setLetterLineIndex((i) => i + 1),
      letterLineIndex === 0 ? 800 : 2400
    );
    return () => clearTimeout(t);
  }, [step, letterLineIndex]);

  return (
    <>
      <audio ref={audioRef} src={SONG_PATH} loop />
      <button
        type="button"
        className="settings-toggle"
        onClick={() => setShowSettings(true)}
        title="Customize"
        aria-label="Customize"
      >
        ⚙️
      </button>
      <button
        type="button"
        className="music-toggle"
        onClick={toggleMusic}
        title={isMusicPlaying ? "Pause music" : "Play music"}
        aria-label={isMusicPlaying ? "Pause music" : "Play music"}
      >
        {isMusicPlaying ? "🔊" : "🔇"}
      </button>
      <div className="floating-hearts" aria-hidden="true">
        {FLOATING_HEARTS.map((heart, i) => (
          <span key={i} style={{ animationDelay: `${i * -1.5}s` }}>
            {heart}
          </span>
        ))}
      </div>

      {showConfetti && (
        <div className="confetti-wrap">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={350}
            recycle={false}
            colors={["#b91c3c", "#e11d48", "#c9a227", "#fad4c8", "#9f1239"]}
          />
        </div>
      )}

      <div className={`container ${step === "success" ? "wide" : ""}`}>
        {step === "landing" && (
          <div className="slide slide-landing">
            <div className="heart-icon" aria-hidden="true">
              ❤️
            </div>
            <h1 className="title">Hey {config.recipientName}.</h1>
            <p className="subtitle">{config.landingSubtitle}</p>
            <button
              type="button"
              className="cta-button primary"
              onClick={() => {
                playMusic();
                setStep("letter");
              }}
            >
              Open it
            </button>
          </div>
        )}

        {step === "letter" && (
          <div className="letter-box slide">
            <div className="letter-content">
              <p className="letter-intro">{config.letterIntro}</p>
              {LETTER_LINES.slice(0, Math.min(letterLineIndex + 1, LETTER_LINES.length)).map((line, i) => (
                <p
                  key={i}
                  className={`letter-line ${i <= letterLineIndex ? "letter-line-visible" : ""}`}
                >
                  {line}
                </p>
              ))}
            </div>
            {letterLineIndex >= LETTER_LINES.length - 1 && (
              <button
                type="button"
                className="cta-button primary"
                onClick={() => setStep("question")}
              >
                Keep going
              </button>
            )}
          </div>
        )}

        {step === "question" && (
          <div className="question-box slide">
            <div className="heart-icon" aria-hidden="true">
              💝
            </div>
            <h2 className="title">Will you be my Valentine?</h2>
            <p className="subtitle">(There's only one right answer. Just saying.)</p>
            <div className="buttons-row">
              <button
                type="button"
                className="yes-btn"
                onClick={handleYes}
              >
                Yes! 💕
              </button>
              <button
                type="button"
                className="no-btn"
                style={{
                  left: `${noButtonPos.x}%`,
                  top: `${noButtonPos.y}%`,
                }}
                onMouseEnter={runAway}
                onClick={runAway}
              >
                No
              </button>
            </div>
            <p className="funny-hint">(The "No" button is just for show. You know you want to say yes. 😏)</p>
          </div>
        )}

        {step === "success" && (
          <div className="success-box slide">
            <div className="heart-icon" aria-hidden="true">
              💕
            </div>
            <h2 className="success-title">Yes. ❤️</h2>
            <p className="success-message success-main">
              {config.successMainMessage}
            </p>
            <p className="success-message">
              {config.valentineMessage}
              {config.footerSignOff && (
                <>
                  {" "}
                  {config.footerSignOff}
                </>
              )}
            </p>
            <div className="reasons-section">
              <p className="reasons-label">Little things that make me love you more:</p>
              <div className="reason-card">
                <p className="reason-text">{REASONS[reasonIndex]}</p>
                <div className="reason-nav">
                  <button
                    type="button"
                    className="reason-btn"
                    onClick={() => setReasonIndex((i) => (i > 0 ? i - 1 : REASONS.length - 1))}
                    aria-label="Previous"
                  >
                    ←
                  </button>
                  <span className="reason-count">
                    {reasonIndex + 1} / {REASONS.length}
                  </span>
                  <button
                    type="button"
                    className="reason-btn"
                    onClick={() => setReasonIndex((i) => (i < REASONS.length - 1 ? i + 1 : 0))}
                    aria-label="Next"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
            {PHOTOS.length > 0 && (
              <div className="photos-section">
                <p className="photos-label">Us</p>
                <div className="photo-grid">
                  {PHOTOS.map((photo, i) => (
                    <button
                      key={i}
                      type="button"
                      className="photo-card"
                      onClick={() => openAlbum(i)}
                    >
                      <div className="photo-frame">
                        <img
                          src={getPhotoSrc(photo)}
                          alt={`Photo ${i + 1}`}
                          className="photo-img photo-animate"
                          style={{ animationDelay: `${i * 0.05}s` }}
                        />
                      </div>
                      <p className="photo-caption-small">{PHOTO_CAPTIONS[i] ?? PHOTO_CAPTIONS[0]}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {albumOpen && (
              <div className="album-overlay" onClick={closeAlbum} role="dialog" aria-modal="true">
                <div className="album-viewer" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="album-close"
                    onClick={closeAlbum}
                    aria-label="Close album"
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    className="album-nav album-prev"
                    onClick={goToPrevPhoto}
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <div className="flipbook-container">
                    <HTMLFlipBook
                      ref={bookRef}
                      width={flipbookSize.width}
                      height={flipbookSize.height}
                      size="fixed"
                      drawShadow
                      flippingTime={600}
                      onFlip={handleFlip}
                      onInit={handleBookInit}
                      className="valentine-flipbook"
                      style={{}}
                    >
                      {PHOTOS.map((photo, i) => (
                        <Page
                          key={i}
                          photo={photo}
                          caption={PHOTO_CAPTIONS[i] ?? PHOTO_CAPTIONS[0]}
                        />
                      ))}
                    </HTMLFlipBook>
                  </div>
                  <button
                    type="button"
                    className="album-nav album-next"
                    onClick={goToNextPhoto}
                    aria-label="Next photo"
                  >
                    →
                  </button>
                  <p className="album-caption">
                    {PHOTO_CAPTIONS[albumPhotoIndex] ?? PHOTO_CAPTIONS[0]}
                  </p>
                  <span className="album-counter">
                    {albumPhotoIndex + 1} / {PHOTOS.length}
                  </span>
                </div>
              </div>
            )}
            <p className="funny-footer">
              P.S. The "No" button was never an option. 😂
            </p>
          </div>
        )}
      </div>

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={config}
        onSave={saveConfig}
        onReset={resetConfig}
      />
    </>
  );
}

export default App;
