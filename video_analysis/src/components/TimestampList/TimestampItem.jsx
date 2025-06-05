import React from 'react';

/**
 * TimestampItem Component - Modern clickable timestamp entry with card design
 * @param {string} time - Formatted time string (e.g., "2:34")
 * @param {string} description - Description of the timestamp
 * @param {number} seconds - Time in seconds
 * @param {function} onClick - Click handler
 */
const TimestampItem = ({ time, description, seconds, onClick }) => {
  return (
    <div className="timestamp-item">
      <button
        className="timestamp-time-button"
        onClick={onClick}
        title={`Jump to ${time}`}
      >
        {time}
      </button>
      <div className="timestamp-description">
        {description}
      </div>
    </div>
  );
};

export default TimestampItem; 