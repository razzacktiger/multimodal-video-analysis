import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import URLInput from './components/URLInput/URLInput';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import TimestampList from './components/TimestampList/TimestampList';
import ChatInterface from './components/ChatInterface/ChatInterface';
import AIService from './utils/aiService';
import './App.css';

export default function App() {
  // State management
  const [videoId, setVideoId] = useState('bFGXQypBf_I'); // Default video - Ottoman History (educational content)
  const [timestamps, setTimestamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timestampProcessingTime, setTimestampProcessingTime] = useState(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  
  // Cancellation state
  const [abortController, setAbortController] = useState(null);
  
  // Refs
  const videoPlayerRef = useRef(null);
  
  // AI Service instance
  const [aiService, setAiService] = useState(null);
  
  // Initialize AI service when API key is available
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (API_KEY) {
      try {
        setAiService(new AIService(API_KEY));
        setError(''); // Clear any previous API key errors
      } catch (err) {
        setError('Failed to initialize AI service. Please check your API key.');
      }
    } else {
      setError('Google AI API key is not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.');
    }
  }, []);
  
  // Handle video loading from URL input
  const handleVideoLoad = (newVideoId) => {
    // Cancel any ongoing chat request when changing videos
    if (abortController) {
      abortController.abort();
      setChatLoading(false);
      setAbortController(null);
    }
    
    setVideoId(newVideoId);
    setTimestamps([]); // Clear previous timestamps
    setChatMessages([]); // Clear chat history
    setError(''); // Clear any previous errors
  };
  
  // Handle timestamp generation
  const handleGenerateTimestamps = async () => {
    if (!aiService) {
      setError('AI service is not initialized. Please check your API key.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Track timing for timestamp generation
    const startTime = Date.now();
    
    try {
      const generatedTimestamps = await aiService.generateTimestamps(videoId);
      
      // Calculate processing time
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      
      setTimestamps(generatedTimestamps);
      setTimestampProcessingTime(processingTime);
      
      // Show success message with timing
      console.log(`Timestamps generated in ${processingTime.toFixed(1)} seconds`);
      
    } catch (err) {
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      
      console.log(`Timestamp generation failed after ${processingTime.toFixed(1)} seconds`);
      setTimestampProcessingTime(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle timestamp click to seek video
  const handleTimestampClick = (timeInSeconds) => {
    console.log(`App.jsx: Received timestamp click for ${timeInSeconds} seconds`);
    
    if (videoPlayerRef.current) {
      console.log('App.jsx: Video player ref found, calling seekTo');
      videoPlayerRef.current.seekTo(timeInSeconds);
    } else {
      console.error('App.jsx: Video player ref not found');
    }
  };
  
  // Handle chat message sending
  const handleSendMessage = async (message) => {
    if (!aiService) {
      setError('AI service is not initialized. Please check your API key.');
      return;
    }

    // Cancel any existing request
    if (abortController) {
      abortController.abort();
    }

    // Create new AbortController for this request
    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    // Track timing
    const startTime = Date.now();

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamps: []
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatLoading(true);

    try {
      // Get AI response with cancellation support
      const response = await aiService.chatWithVideo(
        message, 
        videoId, 
        chatMessages, 
        timestamps,
        newAbortController.signal
      );
      
      // Check if request was cancelled
      if (newAbortController.signal.aborted) {
        return;
      }
      
      // Calculate processing time
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000; // Convert to seconds
      
      // Add AI response to chat with timing
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.content,
        timestamps: response.timestamps || [],
        processingTime: processingTime
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      // Don't show error message if request was cancelled
      if (err.message === 'Request was cancelled') {
        console.log('Chat request was cancelled by user');
        return;
      }
      
      // Calculate processing time for error case too
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      
      // Add error message to chat with timing
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamps: [],
        processingTime: processingTime
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
      setAbortController(null);
    }
  };
  
  // Handle chat message cancellation
  const handleCancelMessage = () => {
    if (abortController) {
      console.log('App.jsx: Cancelling chat request');
      abortController.abort();
      setChatLoading(false);
      setAbortController(null);
    }
  };
  
  // Handle errors from components
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <Container fluid>
          <Row className="justify-content-center">
            <Col md={12} className="text-center">
              <h1 className="app-title">Multimodal Video Analysis Tool</h1>
              <p className="app-subtitle">Analyze videos with AI-powered chat and timestamp navigation</p>
            </Col>
          </Row>
          
          {/* URL Input Section */}
          <Row className="justify-content-center mt-4">
            <Col md={8} lg={6} className="d-flex justify-content-center">
              <URLInput 
                onVideoLoad={handleVideoLoad}
                onError={handleError}
              />
            </Col>
          </Row>
        </Container>
      </header>
      
      {/* Main Content Area */}
      <main className="app-main">
        <Container fluid className="h-100">
          <Row className="h-100">
            {/* Video and Timestamps Section */}
            <Col lg={6} className="video-section">
              <div className="video-container">
                <VideoPlayer 
                  ref={videoPlayerRef}
                  videoId={videoId}
                />
              </div>
              
              {/* Timestamps Section */}
              <div className="timestamps-container">
                <TimestampList
                  timestamps={timestamps}
                  loading={loading}
                  error={error}
                  onGenerateTimestamps={handleGenerateTimestamps}
                  onTimestampClick={handleTimestampClick}
                  processingTime={timestampProcessingTime}
                />
              </div>
            </Col>
            
            {/* Chat Interface Section - Now larger! */}
            <Col lg={6} className="chat-section">
              <div className="chat-container">
                <ChatInterface
                  messages={chatMessages}
                  loading={chatLoading}
                  onSendMessage={handleSendMessage}
                  onTimestampClick={handleTimestampClick}
                  videoId={videoId}
                  onCancelMessage={handleCancelMessage}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}