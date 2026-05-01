import { useState, useEffect, useRef, useCallback } from 'react';
import { getFileUrl } from '../../utils/helpers';
import './StoryViewer.css';

const STORY_DURATION = 5000; // 5 seconds for images

const StoryViewer = ({ highlight, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  
  const [duration, setDuration] = useState(STORY_DURATION);
  
  const progressTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedProgressRef = useRef(0);
  const videoRef = useRef(null);

  const stories = highlight.items || [];
  const currentStory = stories[currentIndex];

  const nextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      pausedProgressRef.current = 0;
      setIsLoading(true);
      setDuration(STORY_DURATION); // Reset to default
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      pausedProgressRef.current = 0;
      setIsLoading(true);
      setDuration(STORY_DURATION);
    } else {
      setProgress(0);
      pausedProgressRef.current = 0;
    }
  }, [currentIndex]);

  const startProgress = useCallback(() => {
    if (isPaused || isLoading) return;

    startTimeRef.current = Date.now() - (pausedProgressRef.current * duration / 100);

    const update = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(currentProgress);

      if (currentProgress < 100) {
        progressTimerRef.current = requestAnimationFrame(update);
      } else {
        nextStory();
      }
    };

    progressTimerRef.current = requestAnimationFrame(update);
  }, [isPaused, isLoading, duration, nextStory]);

  const progressRef = useRef(0);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (isPaused) {
      pausedProgressRef.current = progressRef.current;
      if (videoRef.current) videoRef.current.pause();
    } else {
      if (videoRef.current && !isLoading) videoRef.current.play();
    }
  }, [isPaused, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      startProgress();
    }
    return () => cancelAnimationFrame(progressTimerRef.current);
  }, [currentIndex, isPaused, isLoading, startProgress, duration]);

  const handleMouseDown = () => {
    setIsPaused(true);
    pausedProgressRef.current = progress;
    if (videoRef.current) videoRef.current.pause();
  };

  const handleMouseUp = () => {
    setIsPaused(false);
    if (videoRef.current) videoRef.current.play();
  };

  const handleVideoLoad = (e) => {
    const videoDuration = e.target.duration * 1000;
    if (videoDuration) setDuration(videoDuration);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (stories.length === 0) {
    return (
      <div className="story-viewer-overlay" onClick={onClose} style={{ visibility: 'visible', opacity: 1 }}>
        <div className="story-viewer-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', padding: '20px' }}>
          <button className="story-close-btn" style={{ position: 'absolute', top: '20px', right: '20px' }} onClick={onClose}>✕</button>
          <h2 style={{ marginBottom: '10px' }}>{highlight.title}</h2>
          <p>No stories added to this highlight yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer-container" onClick={e => e.stopPropagation()}>
        {/* Progress Bars */}
        <div className="story-progress-bars">
          {stories.map((_, index) => (
            <div key={index} className="story-progress-bg">
              <div 
                className={`story-progress-fill ${index < currentIndex ? 'completed' : ''} ${index === currentIndex ? 'active' : ''}`}
                style={{ width: index === currentIndex ? `${progress}%` : undefined }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="story-header">
          <div className="story-header-left">
            <img src={getFileUrl(highlight.cover_image)} alt={highlight.title} />
            <span>{highlight.title}</span>
          </div>
          <div className="story-header-right">
            <button className="story-control-btn" onClick={() => {
              if (!isPaused) pausedProgressRef.current = progress;
              setIsPaused(!isPaused);
            }}>
              {isPaused ? (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>
            <button className="story-control-btn" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <button className="story-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="story-content"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          {isLoading && <div className="story-loading"><div className="story-loader"></div></div>}
          
          {currentStory.media_type === 'video' ? (
            <video 
              ref={videoRef}
              src={getFileUrl(currentStory.media_url)} 
              autoPlay 
              muted={isMuted}
              playsInline
              onLoadedMetadata={handleVideoLoad}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
            />
          ) : (
            <img 
              src={getFileUrl(currentStory.media_url)} 
              alt={currentStory.caption || 'Highlight'} 
              onLoad={handleImageLoad}
            />
          )}

          {/* Navigation Areas */}
          <div className="story-nav">
            <div className="story-nav-area" onClick={(e) => { e.stopPropagation(); prevStory(); }} />
            <div className="story-nav-area" onClick={(e) => { e.stopPropagation(); nextStory(); }} />
          </div>

          {currentStory.caption && (
            <div className="story-caption">
              {currentStory.caption}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
