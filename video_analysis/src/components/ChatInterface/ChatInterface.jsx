import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../ChatMessage/ChatMessage';
import ChatInput from './ChatInput';
import './ChatInterface.css';

/**
 * ChatInterface Component - Modern chat interface with card design
 * @param {array} messages - Array of chat messages
 * @param {boolean} loading - Loading state for AI responses
 * @param {function} onSendMessage - Callback when user sends a message
 * @param {function} onTimestampClick - Callback when timestamp is clicked
 * @param {function} onCancelMessage - Callback to cancel ongoing AI request
 * @param {string} videoId - Current video ID for context
 */
const ChatInterface = ({ 
  messages, 
  loading, 
  onSendMessage, 
  onTimestampClick,
  onCancelMessage,
  videoId 
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = (message) => {
    if (!message.trim() || !videoId) return;
    onSendMessage(message);
    setInputMessage('');
  };

  // Suggested questions for users
  const suggestedQuestions = [
    "What is this video about?",
    "Summarize the main points",
    "When does the speaker mention [topic]?",
    "Show me the most important parts"
  ];

  return (
    <div className="chat-interface-container">
      <div className="chat-interface-card">
        <div className="chat-interface-header">
          <h4 className="chat-interface-title">💬 Video Chat</h4>
          <p className="chat-interface-subtitle">Ask questions about the video content</p>
        </div>

        <div className="chat-interface-body">
          <div className="chat-messages-container" ref={messagesContainerRef}>
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <div className="chat-welcome-content">
                  <div className="chat-welcome-icon">🤖</div>
                  <h5 className="chat-welcome-title">Video analysis complete!</h5>
                  <p className="chat-welcome-text">
                    Ask me anything about the content, or click on timestamps to jump to specific sections.
                  </p>
                  
                  <div className="chat-suggested-questions">
                    <p className="chat-suggested-title">Try asking:</p>
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="chat-suggested-question"
                        onClick={() => setInputMessage(question)}
                      >
                        "{question}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onTimestampClick={onTimestampClick}
                />
              ))
            )}
            
            {loading && (
              <div className="chat-typing-indicator">
                <div className="chat-typing-content">
                  <div className="chat-typing-dots">
                    <div className="chat-typing-dot"></div>
                    <div className="chat-typing-dot"></div>
                    <div className="chat-typing-dot"></div>
                  </div>
                  <span className="chat-typing-text">AI is thinking...</span>
                </div>
                {onCancelMessage && (
                  <button
                    onClick={onCancelMessage}
                    className="chat-cancel-button"
                    title="Cancel request"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            disabled={loading || !videoId}
            placeholder={videoId ? "Ask about the video..." : "Please load a video first"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 