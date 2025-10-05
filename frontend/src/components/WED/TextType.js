/**
 * Text Type Animation Component
 * Inspired by reactbits.dev
 * Types out text character by character with cursor effect
 */
import React, { useEffect, useState } from 'react';
import './TextType.css';

const TextType = ({ 
  text, 
  className = '', 
  typingSpeed = 100, 
  deletingSpeed = 50,
  delay = 0,
  loop = false,
  showCursor = true 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initial delay before starting
    const delayTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    let timeout;

    const typeText = () => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
        timeout = setTimeout(typeText, typingSpeed);
      } else if (loop) {
        setIsTyping(false);
        timeout = setTimeout(deleteText, 1000); // Wait before deleting
      }
    };

    const deleteText = () => {
      if (currentIndex > 0) {
        setDisplayText(text.slice(0, currentIndex - 1));
        currentIndex--;
        timeout = setTimeout(deleteText, deletingSpeed);
      } else {
        setIsTyping(true);
        timeout = setTimeout(typeText, 500); // Wait before retyping
      }
    };

    if (isTyping) {
      typeText();
    }

    return () => clearTimeout(timeout);
  }, [hasStarted, isTyping, loop, text, typingSpeed, deletingSpeed]);

  return (
    <span className={`text-type ${className}`}>
      {displayText}
      {showCursor && <span className="text-type-cursor">|</span>}
    </span>
  );
};

export default TextType;
