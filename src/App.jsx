import React, { useState, useCallback, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import HTMLFlipBook from "react-pageflip";
import "./App.css";

const Page = React.forwardRef(({ photo, caption }, ref) => (
  <div className="flip-page" ref={ref}>
    <div className="flip-page-content">
      <div className="flip-page-img-wrap">
        <img src={`/photos/${photo}`} alt={caption} className="flip-page-img" />
      </div>
      <p className="flip-page-caption">{caption}</p>
    </div>
  </div>
));

const FLOATING_HEARTS = ["❤️", "💕", "💗", "💖", "💝", "❤️", "💕", "💗", "💖", "💝"];

const LETTER_LINES = [
  "I've been thinking about us, and I just wanted to put my feelings into words.",
  "It's the little things that mean the most to me — the way you lovingly cook special things for me, your smile when something makes you laugh, the comfort of just being with you.",
  "You make my ordinary days feel special, and my life feels better because of you. I don't say it enough, but I truly cherish you.",
  "Happy Valentine's. I made this with a lot of love, just like what I feel for you.",
];

const REASONS = [
  "You encourage me. Always.",
  "You console me when I'm down.",
  "You listen to me—all my polambals.",
  "You never raise your voice at me.",
  "You support me in whatever I do.",
];

// Add your photo filenames here (place files in public/photos/)
const PHOTOS = [
  "1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg",
  "6.jpeg", "7.jpeg", "8.jpeg", "9.jpeg", "10.jpeg", "11.jpeg", "12.jpeg", "13.jpeg",
  "WhatsApp Image 2026-02-08 at 12.40.06 PM.jpeg",
  "WhatsApp Image 2026-02-08 at 12.40.07 PM (1).jpeg",
];

// Catchy lovable sentences for each photo (edit to match your photos)
const PHOTO_CAPTIONS = [
  "This is us. And I wouldn't want it any other way. 💕",
  "You + me = my favourite equation. ❤️",
  "Every moment with you feels like coming home. 🏠",
  "Life is better with you in the frame. 📸",
  "Forever isn't long enough. Here's to us. 💝",
  "Thank you for every ordinary day. 💕",
  "You make my world brighter. ❤️",
  "Together is my favourite place to be. 🏠",
  "My person. My home. My always. 💝",
  "Here's to us—and all our best moments. 📸",
  "Love you more every day. 💕",
  "Every snapshot, every memory—with you. 💝",
  "Our story, one frame at a time. 💕",
  "Here's to us. Always. ❤️",
  "One more reason to smile. 💕",
];

// Add your Tamil love song as public/songs/love-song.mp3
const SONG_PATH = "/songs/love-song.mp3";

function App() {
  const [step, setStep] = useState("landing");
  const [letterLineIndex, setLetterLineIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 55, y: 55 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });
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
            <h1 className="title">Hey partner.</h1>
            <p className="subtitle">Your partner made something for you.</p>
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
              <p className="letter-intro">From your partner.</p>
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
              You're my person. I'm glad we're doing everything together.
            </p>
            <p className="success-message">
              Happy Valentine's Day! You make my life brighter, happier, and more beautiful every day.
              — Your partner
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
                          src={`/photos/${photo}`}
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
                      width={380}
                      height={520}
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
    </>
  );
}

export default App;
