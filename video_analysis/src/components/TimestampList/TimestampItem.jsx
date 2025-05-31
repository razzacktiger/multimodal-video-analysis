import React from 'react';

/**
 * TimestampItem Component - Individual clickable timestamp entry
 * @param {string} time - Formatted time string (e.g., "2:34")
 * @param {string} description - Description of the timestamp
 * @param {number} seconds - Time in seconds
 * @param {function} onClick - Click handler
 */
const TimestampItem = ({ time, description, seconds, onClick }) => {
  return (
    <li className="mb-2">
      <button
        className="timestamp-button"
        onClick={onClick}
        title={`Jump to ${time}`}
      >
        {time}
      </button>
      <span className="timestamp-description"> - {description}</span>
    </li>
  );
};

export default TimestampItem; 