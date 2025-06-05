import React from 'react';

/**
 * ChatInput Component - Modern chat input with send button
 * @param {string} value - Current input value
 * @param {function} onChange - Input change handler
 * @param {function} onSend - Send message handler
 * @param {boolean} disabled - Whether input is disabled
 * @param {string} placeholder - Input placeholder text
 */
const ChatInput = ({ value, onChange, onSend, disabled, placeholder }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="chat-send-button"
          >
            <span className="chat-send-icon">📤</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput; 