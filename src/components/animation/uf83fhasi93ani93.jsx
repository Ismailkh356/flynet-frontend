import { useState, useEffect, useMemo } from 'react';
import './fh38fjani34.css';

const AnimatedText = () => {
  const texts = useMemo(() => [
    
    "Welcome to FlyNet Downloader",
    "The Most Advanced Video Downloader",
    "Download Unlimited Videos Free Super Fast",
    "Movies, TV Shows, Music, Sports, News etc",
    "Download Videos from TikTok",
    "Download Videos from YouTube",
    "Download Videos from Instagram",
    "Download Videos from Facebook",
    "Download Videos from Twitter",
    "Download Videos from Dailymotion",
    "Download Videos from LinkedIn",
    "Download Videos from Vimeo",
    "Download Videos from Likee",
    "Download Videos from Tumblr",
    "Download Videos from Reddit",
    "Download Videos from Rumble",
    "Download Videos from Twitch",
    "Download Videos from Streamable",
     ], []);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (currentTextIndex < texts.length) {
      const timeout = setTimeout(() => {
        setCurrentText(texts[currentTextIndex].substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);

        if (currentIndex === texts[currentTextIndex].length) {
          setTimeout(() => {
            setCurrentText('');
            setCurrentIndex(0);
            setCurrentTextIndex((currentTextIndex + 1) % texts.length);
          }, 1500); // Delay before starting the next text
        }
      }, 100); // Typing speed

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentTextIndex, texts]);

  return (
    <div className="animated-text-container">
      <h1 className="animated-text">{currentText}</h1>
    </div>
  );
};

export default AnimatedText;