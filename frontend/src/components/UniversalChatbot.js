/**
 * Universal AstroBot AI Chatbot Component (FULL-FEATURED VERSION)
 * Available on all pages like the navigation bar
 * Based on the original NASA Orrery chatbot with AI integration
 */
import React, { useState, useEffect, useRef } from 'react';
import './UniversalChatbot.css';

const UniversalChatbot = ({ 
  position = 'bottom-right',
  theme = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage('Hello! I\'m AstroBot AI. I can help you explore the solar system, track asteroids, and learn about meteor showers.', 'bot');
      }, 500);
    }
  }, [isOpen]);

  // Add message to chat
  const addMessage = (text, sender) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Get user location and find nearby meteor showers (ORIGINAL FUNCTION)
  const findNearbyMeteorShowers = async () => {
    const typingMessage = addMessage('Requesting your location...', 'bot');
    
    if (!navigator.geolocation) {
      // Remove typing message and show error
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      addMessage('Your browser doesn\'t support location services. Please check the Meteor Showers tab for a complete list of visible showers.', 'bot');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Get location name using reverse geocoding (OpenStreetMap Nominatim)
      let locationName = 'Unknown Location';
      try {
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
        const geoData = await geoResponse.json();
        
        // Build location name from components
        const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.municipality;
        const state = geoData.address.state || geoData.address.region;
        const country = geoData.address.country;
        
        if (city && country) {
          locationName = `${city}, ${country}`;
        } else if (state && country) {
          locationName = `${state}, ${country}`;
        } else if (country) {
          locationName = country;
        }
      } catch (geoError) {
        console.warn('Could not get location name:', geoError);
        locationName = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
      }
      
      // Remove typing message
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      
      // Get current date and check meteor showers
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      
      // Meteor showers data (from original meteor-showers.js)
      const meteorShowers = [
        { name: 'Quadrantids', peak: 'Jan 3-4', months: [1], description: 'Blue meteors, 40-120/hr', radiant: 'Northern Hemisphere' },
        { name: 'Lyrids', peak: 'Apr 22-23', months: [4], description: 'Fast meteors, 10-20/hr', radiant: 'Both Hemispheres' },
        { name: 'Eta Aquarids', peak: 'May 5-6', months: [5], description: 'From Halley\'s Comet, 10-30/hr', radiant: 'Southern Hemisphere' },
        { name: 'Delta Aquarids', peak: 'Jul 28-29', months: [7], description: 'Faint meteors, 10-20/hr', radiant: 'Southern Hemisphere' },
        { name: 'Perseids', peak: 'Aug 12-13', months: [8], description: 'Bright fireballs, 50-100/hr', radiant: 'Northern Hemisphere' },
        { name: 'Draconids', peak: 'Oct 8-9', months: [10], description: 'Slow meteors, variable rate', radiant: 'Northern Hemisphere' },
        { name: 'Orionids', peak: 'Oct 21-22', months: [10], description: 'From Halley\'s Comet, 10-20/hr', radiant: 'Both Hemispheres' },
        { name: 'Taurids', peak: 'Nov 5-12', months: [11], description: 'Bright fireballs, 5-10/hr', radiant: 'Both Hemispheres' },
        { name: 'Leonids', peak: 'Nov 17-18', months: [11], description: 'Fast meteors, 10-15/hr', radiant: 'Both Hemispheres' },
        { name: 'Geminids', peak: 'Dec 13-14', months: [12], description: 'Bright & colorful, 50-120/hr', radiant: 'Both Hemispheres' }
      ];

      const visibleShowers = meteorShowers.filter(shower => shower.months.includes(currentMonth));

      let response = `YOUR LOCATION\n${locationName}\n\n`;

      if (visibleShowers.length > 0) {
        response += `ACTIVE METEOR SHOWERS THIS MONTH:\n\n`;
        visibleShowers.forEach(shower => {
          response += `${shower.name}\n`;
          response += `   Peak: ${shower.peak}\n`;
          response += `   Rate: ${shower.description}\n`;
          response += `   Best viewing: ${shower.radiant}\n\n`;
        });

        // Viewing recommendations based on latitude
        response += `VIEWING RECOMMENDATIONS:\n`;
        const hemisphere = latitude >= 0 ? 'Northern' : 'Southern';
        response += `   • You are in the ${hemisphere} Hemisphere\n`;
        
        if (Math.abs(latitude) < 30) {
          response += `   • Excellent position! Most showers visible\n`;
          response += `   • Best time: 2-4 AM local time\n`;
        } else if (Math.abs(latitude) < 60) {
          response += `   • Great viewing conditions!\n`;
          response += `   • Best time: After midnight\n`;
        } else {
          response += `   • Some showers may be low on horizon\n`;
          response += `   • Best time: During twilight hours\n`;
        }
        
        response += `   • Find dark skies away from city lights\n`;
        response += `   • Allow 20-30 min for eye adjustment`;
      } else {
        response += `NO MAJOR METEOR SHOWERS THIS WEEK\n\n`;
        response += `Check the Meteor Showers tab for the complete annual calendar.`;
      }

      addMessage(response, 'bot');

    } catch (error) {
      // Remove typing message
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      
      if (error.code === 1) {
        addMessage('LOCATION ACCESS DENIED\n\nTo receive personalized meteor shower alerts:\n\n1. Click the lock icon in your browser\n2. Enable location permissions\n3. Refresh and try again\n\nOr check the Meteor Showers tab.', 'bot');
      } else if (error.code === 2) {
        addMessage('LOCATION UNAVAILABLE\n\nUnable to determine your location. Please check:\n\n• Internet connection\n• GPS/Location services enabled\n• Try again in a moment\n\nMeanwhile, check the Meteor Showers tab.', 'bot');
      } else {
        addMessage('REQUEST TIMEOUT\n\nLocation request took too long. Please try again or check the Meteor Showers tab for all visible showers worldwide.', 'bot');
      }
    }
  };

  // Send message with FULL AI INTEGRATION (ORIGINAL GEMINI API)
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    // Check if asking about nearby shooting stars
    const lowerText = text.toLowerCase();
    if (lowerText.includes('shooting star') && (lowerText.includes('near') || lowerText.includes('location') || lowerText.includes('where'))) {
      addMessage(text, 'user');
      await findNearbyMeteorShowers();
      return;
    }

    // Add user message
    addMessage(text, 'user');

    // Add typing indicator
    const typingMessage = addMessage('AstroBot is thinking...', 'bot');

    try {
      // Create system context about the app (ORIGINAL CONTEXT)
      const systemContext = `You are AstroBot AI, a friendly space assistant in NASA Live Orrery.

App Features:
- Planets Tab: 8 planets with real-time orbits
- Asteroids Tab: 121 Near-Earth Objects with filters
- Meteor Showers Tab: 16 meteor showers with 3D paths
- Asteroid Belt: 1,000 asteroids between Mars and Jupiter
- Controls: Left-drag (rotate), Right-drag (pan), Scroll (zoom)

Keep responses helpful and under 100 words unless detailed explanation requested.`;

      // Call Gemini AI API with CORRECT format (ORIGINAL API CALL)
      const API_KEY = 'AIzaSyBKsVzKofP4vwwpUz3s-_Rs-mCOVM6TQx8';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemContext + "\n\nUser: " + text
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ API Error Details:', data);
        console.error('Status:', response.status);
        throw new Error(`API Error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
      }

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      
      // Extract AI response
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        addMessage(aiResponse, 'bot');
      } else if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
        addMessage("I can't respond to that due to safety filters. Try asking something else.", 'bot');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ AI Error:', error);
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      
      // Fallback to keyword-based responses (ORIGINAL FALLBACK)
      const response = getBotResponse(text);
      addMessage(response + '\n\n(AI temporarily unavailable, using smart fallback)', 'bot');
    }
  };

  // Fallback keyword-based responses (ORIGINAL FUNCTION)
  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('meteor') || lowerText.includes('shooting star')) {
      return "Check the Meteor Showers tab above! We have 16 real meteor showers you can explore, including Perseids, Geminids, and Leonids. Click any shower to see its 3D orbital path.";
    } else if (lowerText.includes('asteroid') && (lowerText.includes('dangerous') || lowerText.includes('hazardous'))) {
      return "Go to the Asteroids tab to see 121 Near-Earth Objects. You can filter for hazardous asteroids using the checkboxes. Each asteroid shows detailed orbital data and approach information.";
    } else if (lowerText.includes('asteroid belt') || lowerText.includes('rocks')) {
      return "The main asteroid belt is already visible in the Planets tab. It contains 1,000 real asteroids from NASA data, positioned between Mars and Jupiter (2.1-3.3 AU). They have realistic shapes and compositions.";
    } else if (lowerText.includes('planet')) {
      return "You can view all 8 planets in the Planets tab. Click any planet to see detailed information including diameter, temperature, orbital period, and more. The solar system runs in real-time or fast-forward mode.";
    } else if (lowerText.includes('control') || lowerText.includes('how')) {
      return "Controls: Left-click & drag to rotate, right-click to pan, scroll to zoom. Use the tabs to switch between Planets, Asteroids, and Meteor Showers. Time controls let you speed up or pause the simulation.";
    } else {
      return "I'm AstroBot AI! I can help you explore:\n\n• 8 Planets with real-time orbits\n• 121 Near-Earth Asteroids\n• 1,000 Main Belt Asteroids\n• 16 Meteor Showers\n\nWhat would you like to know?";
    }
  };

  // Quick action handlers (ORIGINAL QUICK ACTIONS)
  const handleQuickAction = (message) => {
    // Special handling for location-based query
    if (message.toLowerCase().includes('shooting stars near me')) {
      addMessage(message, 'user');
      findNearbyMeteorShowers();
    } else {
      setInputText('');
      addMessage(message, 'user');
      
      // Add typing indicator and get response
      const typingMessage = addMessage('AstroBot is thinking...', 'bot');
      
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
        const response = getBotResponse(message);
        addMessage(response, 'bot');
      }, 1000);
    }
  };

  // Handle input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`astro-chatbot-container ${position}`}>
      {/* Chat Button */}
      <button 
        className={`astro-chat-button ${isOpen ? 'active' : ''} ${position} ${theme}`}
        onClick={() => setIsOpen(!isOpen)}
        title="AstroBot AI - Your Space Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          {/* Outer orbit ring */}
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none"/>
          
          {/* Planet/Brain hybrid center */}
          <circle cx="24" cy="24" r="10" fill="currentColor" opacity="0.2"/>
          
          {/* Neural network nodes */}
          <circle cx="24" cy="14" r="2" fill="currentColor"/>
          <circle cx="32" cy="20" r="2" fill="currentColor"/>
          <circle cx="32" cy="28" r="2" fill="currentColor"/>
          <circle cx="24" cy="34" r="2" fill="currentColor"/>
          <circle cx="16" cy="28" r="2" fill="currentColor"/>
          <circle cx="16" cy="20" r="2" fill="currentColor"/>
          
          {/* Connection lines (neural pathways) */}
          <path d="M24 14 L32 20 M32 20 L32 28 M32 28 L24 34 M24 34 L16 28 M16 28 L16 20 M16 20 L24 14" 
                stroke="currentColor" strokeWidth="1" opacity="0.4" fill="none"/>
          
          {/* Center AI core */}
          <circle cx="24" cy="24" r="4" fill="currentColor"/>
          
          {/* Orbital satellites (representing data/communication) */}
          <circle cx="24" cy="4" r="1.5" fill="currentColor" opacity="0.6">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="8s"
              repeatCount="indefinite"/>
          </circle>
          <circle cx="44" cy="24" r="1.5" fill="currentColor" opacity="0.6">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="120 24 24"
              to="480 24 24"
              dur="8s"
              repeatCount="indefinite"/>
          </circle>
          <circle cx="24" cy="44" r="1.5" fill="currentColor" opacity="0.6">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="240 24 24"
              to="600 24 24"
              dur="8s"
              repeatCount="indefinite"/>
          </circle>
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <>
          <div className="astro-overlay" onClick={() => setIsOpen(false)} />
          <div className={`astro-chat-window ${position} ${theme} ${isMinimized ? 'minimized' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="astro-chat-header">
              <h3>AstroBot AI</h3>
              <div className="astro-header-actions">
                <button 
                  className="astro-minimize-button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? '□' : '−'}
                </button>
                <button 
                  className="astro-close-button"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="astro-chat-messages">
                  {messages.map((message) => (
                    <div key={message.id} className={`astro-message ${message.sender}`}>
                      <div className="astro-message-content">
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="astro-quick-actions">
                  <button 
                    className="astro-quick-btn"
                    onClick={() => handleQuickAction('shooting stars near me')}
                  >
                    Shooting stars near me
                  </button>
                  <button 
                    className="astro-quick-btn"
                    onClick={() => handleQuickAction('Any dangerous asteroids approaching Earth?')}
                  >
                    Dangerous asteroids approaching Earth?
                  </button>
                  <button 
                    className="astro-quick-btn"
                    onClick={() => handleQuickAction('When is the next meteor shower?')}
                  >
                    When is the next meteor shower?
                  </button>
                </div>

                <div className="astro-input-area">
                  <input
                    type="text"
                    className="astro-message-input"
                    placeholder="Ask about space, asteroids, or anything..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className="astro-send-button"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UniversalChatbot;