/**
 * Utility functions for timestamp processing
 */

/**
 * Parse timestamp string and convert to seconds
 * Supports both MM:SS and HH:MM:SS formats
 * @param {string} timestampStr - Timestamp string (e.g., "2:34" or "1:23:45")
 * @returns {number} - Time in seconds
 */
export const parseTimestamp = (timestampStr) => {
  // Match both MM:SS and HH:MM:SS formats
  const timeMatch = timestampStr.match(/(\d+):(\d+)(?::(\d+))?/);
  if (timeMatch) {
    const hours = timeMatch[3] ? parseInt(timeMatch[1]) : 0;
    const minutes = timeMatch[3] ? parseInt(timeMatch[2]) : parseInt(timeMatch[1]);
    const seconds = timeMatch[3] ? parseInt(timeMatch[3]) : parseInt(timeMatch[2]);
    
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
};

/**
 * Extract timestamp and description from AI response line
 * @param {string} timestampLine - Line from AI response (e.g., "2:34 - Introduction")
 * @returns {object} - Object with time and description
 */
export const parseTimestampLine = (timestampLine) => {
  // Validate input
  if (typeof timestampLine !== 'string') {
    console.error('parseTimestampLine: Input is not a string:', timestampLine);
    return {
      time: 'N/A',
      description: 'Invalid timestamp format',
      seconds: 0
    };
  }
  
  const timeMatch = timestampLine.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
  const timeStr = timeMatch ? timeMatch[1] : '';
  const description = timestampLine.replace(/\d+:\d+(?::\d+)?\s*-\s*/, '');
  
  const result = {
    time: timeStr || 'N/A',
    description: description.trim() || timestampLine.trim(),
    seconds: timeStr ? parseTimestamp(timeStr) : 0
  };
  
  return result;
};

/**
 * Format seconds back to timestamp string
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted timestamp (MM:SS or HH:MM:SS)
 */
export const formatTimestamp = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
};

/**
 * Filter and validate timestamp lines from AI response
 * @param {string} text - Raw AI response text
 * @returns {array} - Array of parsed timestamp objects
 */
export const extractTimestampLines = (text) => {
  console.log('extractTimestampLines: Input text:', text.substring(0, 200) + '...');
  
  const rawLines = text.split('\n').filter(line => line.match(/\d+:\d+(?::\d+)?\s*-/));
  console.log('extractTimestampLines: Found raw lines:', rawLines);
  
  const parsedTimestamps = rawLines.map(line => {
    const parsed = parseTimestampLine(line);
    console.log(`extractTimestampLines: Parsed "${line}" ->`, parsed);
    return parsed;
  });
  
  console.log('extractTimestampLines: Final parsed timestamps:', parsedTimestamps);
  return parsedTimestamps;
}; 