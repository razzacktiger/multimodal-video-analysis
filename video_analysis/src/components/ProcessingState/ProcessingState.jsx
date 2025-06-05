import React from 'react';
import './ProcessingState.css';

/**
 * ProcessingState Component - Shows AI processing progress
 */
const ProcessingState = () => {
  return (
    <div className="processing-container">
      <div className="processing-card">
        <div className="processing-header">
          <h3 className="processing-title">🤖 AI Processing in Progress</h3>
        </div>
        
        <div className="processing-body">
          <div className="processing-spinner-container">
            <div className="processing-spinner"></div>
          </div>
          
          <h4 className="processing-subtitle">
            Analyzing Video with Gemini AI
          </h4>
          
          <div className="processing-steps">
            <p>🎬 Extracting video content</p>
            <p>🕒 Generating intelligent timestamps</p>
            <p>💬 Preparing interactive chat interface</p>
          </div>
          
          <div className="processing-progress-bar">
            <div className="processing-progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingState; 