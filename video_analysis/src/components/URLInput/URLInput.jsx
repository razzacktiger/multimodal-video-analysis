import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { extractVideoId, isValidYouTubeUrl } from '../../utils/videoUtils';
import './URLInput.css';

/**
 * URLInput Component - Handles YouTube URL input and validation
 * @param {function} onVideoLoad - Callback when valid video URL is submitted
 * @param {function} onError - Callback for error handling
 */
const URLInput = ({ onVideoLoad, onError }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const inputUrl = e.target.elements.videoInput.value.trim();
    
    if (!inputUrl) {
      onError('Please enter a YouTube URL');
      return;
    }
    
    if (!isValidYouTubeUrl(inputUrl)) {
      onError('Please enter a valid YouTube URL');
      return;
    }
    
    const videoId = extractVideoId(inputUrl);
    if (videoId) {
      onVideoLoad(videoId);
      onError(''); // Clear any previous errors
    } else {
      onError('Could not extract video ID from URL');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="url-input-form">
      <Form.Group className="mb-3 w-100">
        <Form.Label className="subtitle">Enter YouTube Video URL</Form.Label>
        <Form.Control
          type="text"
          name="videoInput"
          placeholder="https://www.youtube.com/watch?v=..."
          className="user-input"
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="load-button">
        Load Video
      </Button>
    </Form>
  );
};

export default URLInput; 