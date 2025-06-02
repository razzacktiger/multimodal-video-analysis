import React, { useState, useEffect, useRef } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import TimestampItem from './TimestampItem';
import './TimestampList.css';

/**
 * TimestampList Component - Displays and manages video timestamps
 * @param {array} timestamps - Array of timestamp objects (already parsed)
 * @param {boolean} loading - Loading state for timestamp generation
 * @param {string} error - Error message
 * @param {function} onGenerateTimestamps - Callback to generate timestamps
 * @param {function} onTimestampClick - Callback when timestamp is clicked
 * @param {number} processingTime - Time taken to generate timestamps (in seconds)
 */
const TimestampList = ({ 
  timestamps, 
  loading, 
  error, 
  onGenerateTimestamps, 
  onTimestampClick,
  processingTime 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  // Timer for elapsed time during loading
  useEffect(() => {
    if (loading) {
      // Reset and start timer
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 0.1);
      }, 100);
    } else {
      // Stop timer when not loading
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading]);

  return (
    <div className="timestamp-list-container">
      <h3 className="subtitle-timestamps">Video Timestamps</h3>
      
      <Button
        variant="success"
        onClick={onGenerateTimestamps}
        disabled={loading}
        className="generate-button"
      >
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            <span className="ms-2">Generating... ({elapsedTime.toFixed(1)}s)</span>
          </>
        ) : "Generate Timestamps"}
      </Button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {timestamps.length > 0 ? (
        <div className="timestamps-container bg-light p-3 rounded text-start mt-3">
          {processingTime && (
            <div className="processing-info mb-2">
              <small className="text-success">✓ Generated in {processingTime.toFixed(1)}s</small>
            </div>
          )}
          <ul className="list-unstyled">
            {timestamps.map((timestamp, index) => {
              // Handle both parsed objects and raw strings for backwards compatibility
              const timestampData = typeof timestamp === 'string' 
                ? { time: 'N/A', description: timestamp, seconds: 0 }
                : timestamp;
              
              return (
                <TimestampItem
                  key={index}
                  time={timestampData.time}
                  description={timestampData.description}
                  seconds={timestampData.seconds}
                  onClick={() => onTimestampClick(timestampData.seconds)}
                />
              );
            })}
          </ul>
        </div>
      ) : !loading && !error ? (
        <div className="alert-info mt-3">
          No timestamps generated yet. Click the button to generate.
        </div>
      ) : null}
    </div>
  );
};

export default TimestampList; 