/**
 * Utility functions for video processing and URL handling
 */

/**
 * Video utility functions for YouTube URL processing
 */

/**
 * Extracts video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const extractVideoId = (url) => {
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

/**
 * Validates if a URL is a valid YouTube URL
 * @param {string} url - URL to validate
 * @returns {string|false} - Video ID if valid, false if invalid
 */
export const validateYouTubeUrl = (url) => {
  const videoId = extractVideoId(url);
  return videoId || false;
};

/**
 * Creates YouTube embed URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} - YouTube embed URL
 */
export const createEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
};

/**
 * Create embed URL with timestamp
 * @param {string} videoId - YouTube video ID
 * @param {number} startTime - Start time in seconds
 * @returns {string} - Embed URL with timestamp
 */
export const createEmbedUrlWithTimestamp = (videoId, startTime) => {
  return `https://www.youtube.com/embed/${videoId}?start=${startTime}&autoplay=1`;
};

/**
 * Validate YouTube URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid YouTube URL
 */
export const isValidYouTubeUrl = (url) => {
  const videoId = extractVideoId(url);
  return videoId !== null && videoId.length > 0;
}; 