import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { parseTimestamp } from '../../utils/timestampUtils';
import './ChatMessage.css';

/**
 * ChatMessage Component - Individual chat message with markdown support and clickable timestamps
 * @param {object} message - Message object with id, type, content, timestamps
 * @param {function} onTimestampClick - Callback when timestamp is clicked
 */
const ChatMessage = ({ message, onTimestampClick }) => {
  const { type, content, timestamps = [] } = message;
  const contentRef = useRef(null);
  
  // Custom renderer for markdown components (no timestamp links here)
  const components = {
    // Handle paragraphs
    p: ({ children }) => <div className="message-paragraph">{children}</div>,
    
    // Handle lists
    ul: ({ children }) => <ul className="message-list">{children}</ul>,
    li: ({ children }) => <li className="message-list-item">{children}</li>,
    
    // Handle emphasis and strong
    em: ({ children }) => <em className="message-emphasis">{children}</em>,
    strong: ({ children }) => <strong className="message-strong">{children}</strong>,
    
    // Handle regular links only
    a: ({ href, children, ...props }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  };

  // Clean up the content without converting timestamps to links
  const cleanContent = (text) => {
    return text
      // Remove malformed bold markers like "** **"
      .replace(/\*\*\s*\*\*/g, '')
      // Fix trailing asterisks after timestamps like "0:00**" -> "0:00"
      .replace(/(\d{1,2}:\d{2}(?::\d{2})?)\*\*/g, '$1')
      // Fix trailing asterisks after numbers like "1:00**" -> "1:00" 
      .replace(/(\d+)\*\*/g, '$1')
      // Fix trailing asterisks after text/colons like "Text**:" -> "Text:"
      .replace(/\*\*([:\.,;!?])/g, '$1')
      // Fix leading asterisks before text like "**Text" -> "Text" (only if not proper bold)
      .replace(/\*\*([^*\s][^*]*?)(?!\*\*)/g, '$1')
      // Remove orphaned double asterisks at end of lines
      .replace(/\*\*$/gm, '')
      // Remove orphaned double asterisks at start of lines  
      .replace(/^\*\*/gm, '')
      // Fix bullet points that got mangled
      .replace(/\*\s+\*\*/g, '* ')
      // Clean up extra asterisks (3 or more)
      .replace(/\*{3,}/g, '**')
      // Remove empty bullet points
      .replace(/^\*\s*$/gm, '')
      // Clean up multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();
  };

  // Post-process the rendered content to make timestamps clickable
  useEffect(() => {
    if (!contentRef.current || !onTimestampClick) {
      console.log('ChatMessage: useEffect skipped - missing ref or callback');
      return;
    }

    console.log('ChatMessage: Processing timestamps in content');

    const handleTimestampClick = (timestampText, seconds) => {
      console.log(`ChatMessage: Timestamp clicked: ${timestampText} (${seconds} seconds)`);
      onTimestampClick(seconds);
    };

    // Find and replace timestamps in text nodes
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        
        // First check if text contains timestamps (separate regex instance)
        const hasTimestamps = /\b(\d{1,2}:\d{2}(?::\d{2})?)\b/.test(text);
        
        if (hasTimestamps) {
          console.log(`Found timestamps in text: "${text}"`);
          
          // Create fresh regex for actual processing
          const timestampRegex = /\b(\d{1,2}:\d{2}(?::\d{2})?)\b/g;
          
          // Create wrapper span
          const wrapper = document.createElement('span');
          let lastIndex = 0;
          let match;
          
          // Process all matches with null check
          while ((match = timestampRegex.exec(text)) !== null) {
            if (!match || !match[1]) {
              console.warn('Invalid match found, skipping');
              break;
            }
            
            // Add text before timestamp
            if (match.index > lastIndex) {
              wrapper.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }
            
            // Create timestamp span
            const timestampSpan = document.createElement('span');
            timestampSpan.className = 'chat-timestamp-link';
            timestampSpan.textContent = match[1];
            timestampSpan.title = `Jump to ${match[1]}`;
            timestampSpan.setAttribute('role', 'button');
            timestampSpan.setAttribute('tabindex', '0');
            
            const seconds = parseTimestamp(match[1]);
            console.log(`Creating timestamp link: ${match[1]} -> ${seconds} seconds`);
            
            // Create closure to capture the current match values
            ((timestampText, timestampSeconds) => {
              // Add event listeners
              timestampSpan.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Timestamp span clicked: ${timestampText}`);
                handleTimestampClick(timestampText, timestampSeconds);
              });
              
              timestampSpan.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTimestampClick(timestampText, timestampSeconds);
                }
              });
            })(match[1], seconds);
            
            wrapper.appendChild(timestampSpan);
            lastIndex = match.index + match[1].length;
            
            // Prevent infinite loops
            if (timestampRegex.lastIndex === match.index) {
              console.warn('Regex not advancing, breaking loop');
              break;
            }
          }
          
          // Add remaining text
          if (lastIndex < text.length) {
            wrapper.appendChild(document.createTextNode(text.slice(lastIndex)));
          }
          
          // Replace the text node
          if (node.parentNode && wrapper.hasChildNodes()) {
            node.parentNode.replaceChild(wrapper, node);
            console.log('Replaced text node with timestamp links');
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Process child nodes (convert to array to avoid live collection issues)
        Array.from(node.childNodes).forEach(child => processNode(child));
      }
    };

    // Process the entire content
    processNode(contentRef.current);
    console.log('ChatMessage: Finished processing timestamps');
  }, [content, onTimestampClick]);

  const processedContent = cleanContent(content);

  return (
    <div className={`chat-message ${type === 'user' ? 'user-message' : 'ai-message'}`}>
      <div ref={contentRef} className="message-content">
        <ReactMarkdown components={components}>
          {processedContent}
        </ReactMarkdown>
      </div>
      
      {/* Render additional timestamps if provided */}
      {timestamps.length > 0 && (
        <div className="message-timestamps">
          <div className="timestamps-header">Related timestamps:</div>
          {timestamps.map((timestamp, index) => {
            const handleRelatedTimestampClick = () => {
              console.log(`ChatMessage: Related timestamp clicked: ${timestamp.time} (${timestamp.seconds} seconds)`);
              if (onTimestampClick && typeof onTimestampClick === 'function') {
                onTimestampClick(timestamp.seconds);
              }
            };
            
            return (
              <button
                key={index}
                className="chat-timestamp-button"
                onClick={handleRelatedTimestampClick}
                title={`Jump to ${timestamp.time}`}
                type="button"
              >
                {timestamp.time} - {timestamp.description}
              </button>
            );
          })}
        </div>
      )}
      
      <div className="message-time">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {message.processingTime && message.type === 'ai' && (
          <span className="processing-time"> · {message.processingTime.toFixed(1)}s</span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 