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
  const [videoId, setVideoId] = useState('xNRJwmlRBNU'); // Default video
  const [timestamps, setTimestamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  
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
    
    try {
      const generatedTimestamps = await aiService.generateTimestamps(videoId);
      setTimestamps(generatedTimestamps);
    } catch (err) {
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
      // Get AI response
      const response = await aiService.chatWithVideo(
        message, 
        videoId, 
        chatMessages, 
        timestamps
      );
      
      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.content,
        timestamps: response.timestamps || []
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamps: []
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };
  
  // Handle errors from components
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <>
      <h1 className="title">Multimodal video analysis tool</h1>
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Container className="mt-4 text-center" fluid>
          {/* URL Input Section */}
          <Row className="justify-content-center">
            <Col md={8} className="mb-4 d-flex justify-content-center">
              <URLInput 
                onVideoLoad={handleVideoLoad}
                onError={handleError}
              />
            </Col>
          </Row>
          
          {/* Main Content Area */}
          <Row className="embed-responsive-item">
            {/* Video Player */}
            <Col lg={8}>
              <VideoPlayer 
                ref={videoPlayerRef}
                videoId={videoId}
              />
              
              {/* Timestamps Section - Below video on larger screens */}
              <div className="mt-4">
                <TimestampList
                  timestamps={timestamps}
                  loading={loading}
                  error={error}
                  onGenerateTimestamps={handleGenerateTimestamps}
                  onTimestampClick={handleTimestampClick}
                />
              </div>
            </Col>
            
            {/* Chat Interface */}
            <Col lg={4}>
              <ChatInterface
                messages={chatMessages}
                loading={chatLoading}
                onSendMessage={handleSendMessage}
                onTimestampClick={handleTimestampClick}
                videoId={videoId}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}