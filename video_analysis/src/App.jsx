import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

export default function App() {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/xNRJwmlRBNU?si=ptewSZO2p0Mjs45V');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const inputUrl = e.target.elements.videoInput.value;
    // Convert YouTube URL to embed URL
    if (inputUrl) {
      // Handle different YouTube URL formats
      let videoId = '';
      if (inputUrl.includes('youtube.com/watch?v=')) {
        videoId = new URL(inputUrl).searchParams.get('v');
      } else if (inputUrl.includes('youtu.be/')) {
        videoId = inputUrl.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Container className="mt-4 text-center">
        <h1 className="mb-4 text-center">YouTube Video Viewer</h1>
        <Row className="justify-content-center">
          <Col md={6} className="mb-4 d-flex justify-content-center">
            <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-100">
              <Form.Group className="mb-3 w-100">
                <Form.Label className="text-center d-block">Enter YouTube Video URL</Form.Label>
                <Form.Control 
                  type="text"
                  name="videoInput"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="text-center"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mx-auto">
                Load Video
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={10} className="d-flex justify-content-center">
            <div className='ratio ratio-16x9' style={{ maxHeight: '80vh', width: '100%' }}>
              <iframe 
                src={videoUrl} 
                title="YouTube video" 
                allowFullScreen
                className="w-100 h-100"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}