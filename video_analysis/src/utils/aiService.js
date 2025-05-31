import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractTimestampLines } from './timestampUtils';

/**
 * AI Service for Google Gemini integration
 */
class AIService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Google AI API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
  }

  /**
   * Generate timestamps for a YouTube video
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<array>} - Array of timestamp strings
   */
  async generateTimestamps(videoId) {
    try {
      const result = await this.model.generateContent([
        "Please create time-stamps for the video and make sure its in the format of 00:00 - title. Provide clear, descriptive titles for each section.",
        {
          fileData: {
            fileUri: `https://www.youtube.com/watch?v=${videoId}`,
          },
        },
      ]);

      const text = result.response.text();
      return extractTimestampLines(text);
    } catch (error) {
      console.error('Error generating timestamps:', error);
      throw new Error('Failed to generate timestamps. Please check your API key and try again.');
    }
  }

  /**
   * Chat with video content
   * @param {string} message - User message
   * @param {string} videoId - YouTube video ID
   * @param {array} context - Previous conversation context
   * @param {array} existingTimestamps - Previously generated timestamps for context
   * @returns {Promise<object>} - AI response with content and timestamps
   */
  async chatWithVideo(message, videoId, context = [], existingTimestamps = []) {
    try {
      // Build context from previous messages
      const conversationHistory = context.slice(-6).map(msg => 
        `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      // Build timestamp context
      const timestampContext = existingTimestamps.length > 0 
        ? `\n\nExisting video timestamps:\n${existingTimestamps.slice(0, 10).join('\n')}`
        : '';

      const prompt = `You are a helpful video analysis assistant. Analyze the video content and provide a clear, well-formatted response.

IMPORTANT FORMATTING RULES:
- Write naturally with clear paragraphs
- When referencing specific moments, use exact timestamps like "At 2:34" or "Around 1:23:45"
- Use **bold text** for important points
- Use bullet points with standard format: "* Point one" or "- Point one"
- Write conversationally - timestamps will automatically become clickable
- Do NOT use any special link formatting - just write timestamps normally in text

RESPONSE GUIDELINES:
1. Be helpful and conversational
2. Include specific timestamps when relevant (MM:SS or HH:MM:SS format)  
3. Describe visual elements clearly when asked
4. Provide structured information when helpful
5. Reference specific moments with natural language like "At 2:34, you can see..." or "The key point at 1:23 shows..."

Previous conversation:
${conversationHistory}

${timestampContext}

User question: ${message}

Provide a helpful response with natural language and relevant timestamps.`;

      const result = await this.model.generateContent([
        prompt,
        {
          fileData: {
            fileUri: `https://www.youtube.com/watch?v=${videoId}`,
          },
        },
      ]);

      const responseText = result.response.text();
      
      // Extract any new timestamps from the response
      const newTimestamps = extractTimestampLines(responseText);
      
      return {
        content: responseText,
        timestamps: newTimestamps,
        hasTimestamps: newTimestamps.length > 0
      };
    } catch (error) {
      console.error('Error in chat with video:', error);
      throw new Error('Failed to process your question. Please try again.');
    }
  }

  /**
   * Search for specific visual elements or content in video
   * @param {string} query - Search query (e.g., "find the part with the graph")
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<object>} - Search results with timestamps and descriptions
   */
  async searchVideoContent(query, videoId) {
    try {
      const prompt = `Find specific content in this video: "${query}"

      Provide a clean, well-formatted response with:

      **Search Results:**
      * List specific moments that match the query
      * Include exact timestamps (MM:SS or HH:MM:SS format)
      * Describe what's happening at each timestamp
      * If no exact matches, suggest related content

      Use clean markdown formatting - proper bullet points, bold text for headings, and clear paragraph structure.`;

      const result = await this.model.generateContent([
        prompt,
        {
          fileData: {
            fileUri: `https://www.youtube.com/watch?v=${videoId}`,
          },
        },
      ]);

      const responseText = result.response.text();
      const timestamps = extractTimestampLines(responseText);
      
      return {
        content: responseText,
        timestamps: timestamps,
        query: query
      };
    } catch (error) {
      console.error('Error searching video content:', error);
      throw new Error('Failed to search video content. Please try again.');
    }
  }
}

export default AIService; 