import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import ChatMessage from '../ChatMessage/ChatMessage';
import './ChatInterface.css';

/**
 * ChatInterface Component - Main chat interface with message history and input
 * @param {array} messages - Array of chat messages
 * @param {boolean} loading - Loading state for AI responses
 * @param {function} onSendMessage - Callback when user sends a message
 * @param {function} onTimestampClick - Callback when timestamp is clicked
 * @param {string} videoId - Current video ID for context
 */
const ChatInterface = ({ 
  messages, 
  loading, 
  onSendMessage, 
  onTimestampClick,
  videoId 
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = inputMessage.trim();
    
    if (!message) return;
    
    if (!videoId) {
      // Could add a toast notification here
      return;
    }

    onSendMessage(message);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Suggested questions for users
  const suggestedQuestions = [
    "What is this video about?",
    "Summarize the main points",
    "When does the speaker mention [topic]?",
    "Show me the most important parts"
  ];

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h4 className="chat-title">Video Chat Assistant</h4>
        <p className="chat-subtitle">Ask questions about the video content</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-message">
              <h5>👋 Welcome to Video Chat!</h5>
              <p>Ask me anything about the video. I can help you:</p>
              <ul>
                <li>Find specific topics or moments</li>
                <li>Summarize content</li>
                <li>Locate visual elements</li>
                <li>Answer questions about what's shown</li>
              </ul>
              
              <div className="suggested-questions">
                <p><strong>Try asking:</strong></p>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="suggested-question"
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
          <div className="typing-indicator">
            <div className="typing-dots">
              <Spinner animation="grow" size="sm" />
              <span className="ms-2">AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <Form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-group">
          <Form.Control
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={videoId ? "Ask about the video..." : "Please load a video first"}
            disabled={loading || !videoId}
            className="chat-input"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !inputMessage.trim() || !videoId}
            className="send-button"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <i className="bi bi-send">Send</i>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChatInterface; 