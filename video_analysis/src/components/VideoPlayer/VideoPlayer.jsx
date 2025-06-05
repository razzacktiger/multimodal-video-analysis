import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { createEmbedUrl, createEmbedUrlWithTimestamp } from '../../utils/videoUtils';
import './VideoPlayer.css';

/**
 * VideoPlayer Component - Modern YouTube video player with card design
 * @param {string} videoId - YouTube video ID
 * @param {object} ref - Forwarded ref for external control
 */
const VideoPlayer = forwardRef(({ videoId }, ref) => {
  const iframeRef = useRef(null);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    seekTo: (timeInSeconds) => {
      console.log(`VideoPlayer: seekTo called with ${timeInSeconds} seconds`);
      
      if (iframeRef.current && videoId) {
        const newUrl = createEmbedUrlWithTimestamp(videoId, timeInSeconds);
        console.log(`VideoPlayer: Setting iframe src to: ${newUrl}`);
        iframeRef.current.src = newUrl;
      } else {
        console.error('VideoPlayer: iframe ref or videoId not available', {
          iframeRef: !!iframeRef.current,
          videoId: videoId
        });
      }
    }
  }));
  
  const videoUrl = videoId ? createEmbedUrl(videoId) : '';
  
  return (
    <div className="video-player-container">
      <div className="video-player-card">
        <div className="video-player-header">
          <h4 className="video-player-title">🎥 Video Player</h4>
        </div>
        <div className="video-player-body">
          <div className="video-embed-container">
            <iframe
              ref={iframeRef}
              src={videoUrl}
              title="YouTube video"
              allowFullScreen
              className="video-embed"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer; 