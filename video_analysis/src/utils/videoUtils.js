/**
 * Utility functions for video processing and URL handling
 */

/**
 * Extract video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const extractVideoId = (url) => {
  if (!url) return null;
  
  try {
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      return new URL(url).searchParams.get('v');
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return null;
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return null;
  }
};

/**
 * Convert video ID to embed URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Embed URL
 */
export const createEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}`;
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