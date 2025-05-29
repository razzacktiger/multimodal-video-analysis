import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css'; // Assuming you have some custom styles

export default function App() {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/xNRJwmlRBNU?si=ptewSZO2p0Mjs45V');
  const [videoId, setVideoId] = useState('xNRJwmlRBNU');
  const [timestamps, setTimestamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const inputUrl = e.target.elements.videoInput.value;
    // Convert YouTube URL to embed URL
    if (inputUrl) {
      // Handle different YouTube URL formats
      let extractedVideoId = '';
      if (inputUrl.includes('youtube.com/watch?v=')) {
        extractedVideoId = new URL(inputUrl).searchParams.get('v');
      } else if (inputUrl.includes('youtu.be/')) {
        extractedVideoId = inputUrl.split('youtu.be/')[1].split('?')[0];
      }
      
      if (extractedVideoId) {
        setVideoUrl(`https://www.youtube.com/embed/${extractedVideoId}`);
        setVideoId(extractedVideoId);
        setTimestamps([]); // Clear previous timestamps
      }
    }
  };

  const generateTimestamps = async () => {
    setLoading(true);
    setError('');
    
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA16GvRnUOfXiOJTtk88HgSIZtvlTobg5A");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const result = await model.generateContent([
        "Please create time-stamps for the video and make sure its in the format of 00:00 - title.",
        {
          fileData: {
            fileUri: `https://www.youtube.com/watch?v=${videoId}`,
          },
        },
      ]);

      const text = result.response.text();
      const timestampLines = text.split('\n').filter(line => line.match(/\d+:\d+\s*-/));
      setTimestamps(timestampLines);
    } catch (err) {
      setError('Failed to generate timestamps. Please try again later.');
      console.error('Error generating timestamps:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <h1 className="title">Multimodal video analysis tool</h1>
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Container className="mt-4 text-center" fluid>
        <Row className="justify-content-center">
          <Col md={8} className="mb-4 d-flex justify-content-center">
            <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-100">
              <Form.Group className="mb-3 w-100">
                <Form.Label className="subtitle">Enter YouTube Video URL</Form.Label>
                <Form.Control
                  type="text"
                  name="videoInput"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="user-input" />
              </Form.Group>
              <Button variant="primary" type="submit" className="load-button">
                Load Video
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="embed-responsive-item">
          <Col>
            <div className='ratio ratio-16x9'>
              <iframe
                src={videoUrl}
                title="YouTube video"
                allowFullScreen
                className="embed-responsive-item"
              ></iframe>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <h3 className='subtitle-timestamps'>Video Timestamps</h3>
            <Button
              variant="success"
              onClick={generateTimestamps}
              disabled={loading}
              className="generate-button"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Generating...</span>
                </>
              ) : "Generate Timestamps"}
            </Button>

            {error && <div className="alert alert-danger">{error}</div>}

            {timestamps.length > 0 ? (
              <div className="timestamps-container bg-light p-3 rounded text-start">
                <ul className="list-unstyled">
                  {timestamps.map((timestamp, index) => (
                    <li key={index} className="mb-2">{timestamp}</li>
                  ))}
                </ul>
              </div>
            ) : !loading && (error === '' || error === 'Failed to generate timestamps. Please try again later.') ? (
              <div className="alert-info">No timestamps generated yet. Click the button to generate.</div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </div></>
  );
}