import React, { useState, useEffect, useRef } from 'react';
import TimestampItem from './TimestampItem';
import './TimestampList.css';

/**
 * TimestampList Component - Modern timestamp display with card design
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
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading]);

  return (
    <div className="timestamp-list-container">
      <div className="timestamp-list-card">
        <div className="timestamp-list-header">
          <h4 className="timestamp-list-title">⏰ Smart Timestamps</h4>
        </div>
        
        <div className="timestamp-list-body">
          <button
            onClick={onGenerateTimestamps}
            disabled={loading}
            className={`timestamp-generate-button ${loading ? 'timestamp-generate-button-loading' : ''}`}
          >
            {loading ? (
              <div className="timestamp-generate-loading">
                <div className="timestamp-generate-spinner"></div>
                <span>Generating... ({elapsedTime.toFixed(1)}s)</span>
              </div>
            ) : (
              <div className="timestamp-generate-content">
                <span className="timestamp-generate-emoji">✨</span>
                Generate Timestamps
              </div>
            )}
          </button>

          {error && (
            <div className="timestamp-error">
              ❌ {error}
            </div>
          )}

          {timestamps.length > 0 ? (
            <div className="timestamp-content">
              {processingTime && (
                <div className="timestamp-success">
                  ✓ Generated in {processingTime.toFixed(1)}s
                </div>
              )}
              <div className="timestamp-items">
                {timestamps.map((timestamp, index) => {
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
              </div>
            </div>
          ) : !loading && !error ? (
            <div className="timestamp-empty">
              <div className="timestamp-empty-icon">🎬</div>
              <p className="timestamp-empty-text">
                No timestamps generated yet. Click the button to generate.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TimestampList; 