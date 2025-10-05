import React from 'react';
import './GlitchText.css';

const GlitchText = ({ children, className = '' }) => {
  // Convert children to string, preserving line breaks
  const textContent = React.Children.toArray(children)
    .map(child => {
      if (typeof child === 'string') return child;
      if (child.type === 'br') return '\n';
      return '';
    })
    .join('');

  return (
    <div className={`glitch-wrapper ${className}`}>
      <div className="glitch" data-text={textContent}>
        {children}
      </div>
    </div>
  );
};

export default GlitchText;
