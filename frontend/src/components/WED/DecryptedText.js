/**
 * Decrypted Text Animation Component
 * Inspired by reactbits.dev
 */
import React, { useEffect, useState } from 'react';
import './DecryptedText.css';

const DecryptedText = ({ text, className = '', interval = 50, revealDirection = 'start' }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  useEffect(() => {
    if (!isDecrypting) return;

    let currentIndex = revealDirection === 'start' ? 0 : text.length - 1;
    const increment = revealDirection === 'start' ? 1 : -1;
    const iterations = text.length;
    let iteration = 0;

    const intervalId = setInterval(() => {
      setDisplayText((prev) => {
        const textArray = prev.split('');
        
        if (revealDirection === 'start') {
          // Decrypt from start to end
          for (let i = 0; i < text.length; i++) {
            if (i < currentIndex) {
              textArray[i] = text[i];
            } else {
              textArray[i] = characters[Math.floor(Math.random() * characters.length)];
            }
          }
        } else {
          // Decrypt from end to start
          for (let i = 0; i < text.length; i++) {
            if (i > currentIndex) {
              textArray[i] = text[i];
            } else {
              textArray[i] = characters[Math.floor(Math.random() * characters.length)];
            }
          }
        }
        
        return textArray.join('');
      });

      if (iteration >= iterations) {
        clearInterval(intervalId);
        setDisplayText(text);
      }

      currentIndex += increment;
      iteration++;
    }, interval);

    return () => clearInterval(intervalId);
  }, [isDecrypting, text, interval, revealDirection, characters]);

  const handleMouseEnter = () => {
    setIsDecrypting(true);
    setDisplayText(text.split('').map(() => characters[Math.floor(Math.random() * characters.length)]).join(''));
  };

  const handleMouseLeave = () => {
    setIsDecrypting(false);
    setDisplayText(text);
  };

  return (
    <span
      className={`decrypted-text ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText || text}
    </span>
  );
};

export default DecryptedText;
