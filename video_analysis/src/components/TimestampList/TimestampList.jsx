import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { parseTimestampLine } from '../../utils/timestampUtils';
import TimestampItem from './TimestampItem';
import './TimestampList.css';

/**
 * TimestampList Component - Displays and manages video timestamps
 * @param {array} timestamps - Array of timestamp strings
 * @param {boolean} loading - Loading state for timestamp generation
 * @param {string} error - Error message
 * @param {function} onGenerateTimestamps - Callback to generate timestamps
 * @param {function} onTimestampClick - Callback when timestamp is clicked
 */
const TimestampList = ({ 
  timestamps, 
  loading, 
  error, 
  onGenerateTimestamps, 
  onTimestampClick 
}) => {
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
            <span className="ms-2">Generating...</span>
          </>
        ) : "Generate Timestamps"}
      </Button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {timestamps.length > 0 ? (
        <div className="timestamps-container bg-light p-3 rounded text-start mt-3">
          <ul className="list-unstyled">
            {timestamps.map((timestamp, index) => {
              const parsedTimestamp = parseTimestampLine(timestamp);
              return (
                <TimestampItem
                  key={index}
                  time={parsedTimestamp.time}
                  description={parsedTimestamp.description}
                  seconds={parsedTimestamp.seconds}
                  onClick={() => onTimestampClick(parsedTimestamp.seconds)}
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