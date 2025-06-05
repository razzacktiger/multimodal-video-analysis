import { useState, useEffect, useRef } from 'react';
import AIService from '../utils/aiService';

export const useAppState = () => {
  // UI Flow State - this is the key addition from the frontend project
  const [currentStep, setCurrentStep] = useState('landing'); // 'landing', 'processing', 'loaded'
  const [videoUrl, setVideoUrl] = useState('');
  
  // Existing state from your main project
  const [videoId, setVideoId] = useState('bFGXQypBf_I'); // Keep default for development
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

  // Extract video ID from URL (from frontend project)
  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Validate YouTube URL (from frontend project)
  const validateYouTubeUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return false;
    }
    setError('');
    return videoId;
  };

  // Enhanced video submission handler (merging both approaches)
  const handleVideoSubmit = async (url) => {
    const extractedId = validateYouTubeUrl(url);
    if (!extractedId) return;

    // Clear previous state
    if (abortController) {
      abortController.abort();
      setChatLoading(false);
      setAbortController(null);
    }

    // Set processing state
    setCurrentStep('processing');
    setVideoId(extractedId);
    setTimestamps([]); 
    setChatMessages([]); 
    setLoading(true);
    setError('');

    // Track timing for timestamp generation
    const startTime = Date.now();

    try {
      if (aiService) {
        const generatedTimestamps = await aiService.generateTimestamps(extractedId);
        
        // Calculate processing time
        const endTime = Date.now();
        const processingTime = (endTime - startTime) / 1000;
        
        setTimestamps(generatedTimestamps);
        setTimestampProcessingTime(processingTime);
        
        // Add welcome message
        setChatMessages([{
          id: Date.now(),
          type: 'ai',
          content: '✨ Video analysis complete! Ask me anything about the content.',
          timestamps: []
        }]);
        
        console.log(`Timestamps generated in ${processingTime.toFixed(1)} seconds`);
      }
      
      setCurrentStep('loaded');
    } catch (err) {
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      
      console.log(`Timestamp generation failed after ${processingTime.toFixed(1)} seconds`);
      setTimestampProcessingTime(null);
      setError(err.message);
      setCurrentStep('landing'); // Go back to landing on error
    } finally {
      setLoading(false);
    }
  };

  // Handle timestamp generation (existing functionality)
  const handleGenerateTimestamps = async () => {
    if (!aiService) {
      setError('AI service is not initialized. Please check your API key.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const startTime = Date.now();
    
    try {
      const generatedTimestamps = await aiService.generateTimestamps(videoId);
      
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      
      setTimestamps(generatedTimestamps);
      setTimestampProcessingTime(processingTime);
      
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

  // Handle timestamp click (existing functionality)
  const handleTimestampClick = (timeInSeconds) => {
    console.log(`App: Received timestamp click for ${timeInSeconds} seconds`);
    
    if (videoPlayerRef.current) {
      console.log('App: Video player ref found, calling seekTo');
      videoPlayerRef.current.seekTo(timeInSeconds);
    } else {
      console.error('App: Video player ref not found');
    }
  };

  // Handle chat message sending (existing functionality)
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
      const processingTime = (endTime - startTime) / 1000;
      
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

  // Handle chat message cancellation (existing functionality)
  const handleCancelMessage = () => {
    if (abortController) {
      console.log('App: Cancelling chat request');
      abortController.abort();
      setChatLoading(false);
      setAbortController(null);
    }
  };

  // Handle errors from components (existing functionality)
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // Handle video loading from URL input (existing functionality)
  const handleVideoLoad = (newVideoId) => {
    // Cancel any ongoing chat request when changing videos
    if (abortController) {
      abortController.abort();
      setChatLoading(false);
      setAbortController(null);
    }
    
    setVideoId(newVideoId);
    setTimestamps([]);
    setChatMessages([]);
    setError('');
    setCurrentStep('loaded'); // Go directly to loaded state for URL input component
  };

  // Initialize AI service (existing functionality)
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (API_KEY) {
      try {
        setAiService(new AIService(API_KEY));
        setError('');
      } catch (err) {
        setError('Failed to initialize AI service. Please check your API key.');
      }
    } else {
      setError('Google AI API key is not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.');
    }
  }, []);

  // Cleanup on unmount (existing functionality)
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  return {
    // UI Flow State
    currentStep,
    setCurrentStep,
    videoUrl,
    setVideoUrl,
    
    // Video State
    videoId,
    setVideoId,
    timestamps,
    setTimestamps,
    loading,
    setLoading,
    error,
    setError,
    timestampProcessingTime,
    
    // Chat State
    chatMessages,
    setChatMessages,
    chatLoading,
    setChatLoading,
    
    // Services & Refs
    aiService,
    videoPlayerRef,
    abortController,
    setAbortController,
    
    // Actions
    handleVideoSubmit,
    handleGenerateTimestamps,
    handleTimestampClick,
    handleSendMessage,
    handleCancelMessage,
    handleError,
    handleVideoLoad,
    extractVideoId,
    validateYouTubeUrl
  };
}; 