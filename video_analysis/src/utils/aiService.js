import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractTimestampLines } from "./timestampUtils";
import { YoutubeTranscript } from "youtube-transcript";

/**
 * AI Service for Google Gemini integration
 */
class AIService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("Google AI API key is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });
  }

  /**
   * Generate timestamps for a YouTube video
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<array>} - Array of timestamp strings
   */
  async generateTimestamps(videoId) {
    try {
      console.log(`AIService: Generating timestamps for video ID: ${videoId}`);

      const result = await this.model.generateContent([
        "Please create time-stamps for the video and make sure its in the format of 00:00 - title. Provide clear, descriptive titles for each section.",
        {
          fileData: {
            fileUri: `https://www.youtube.com/watch?v=${videoId}`,
          },
        },
      ]);

      // Check if response was blocked
      if (result.response.promptFeedback?.blockReason) {
        const blockReason = result.response.promptFeedback.blockReason;
        console.error("AIService: Response blocked due to:", blockReason);

        let errorMessage = `Content was blocked by safety filters (${blockReason}).`;

        // Provide specific guidance based on block reason
        switch (blockReason) {
          case "OTHER":
            errorMessage +=
              " This video may contain content that doesn't meet AI safety guidelines. Try educational videos like tutorials, documentaries, or lectures.";
            break;
          case "SAFETY":
            errorMessage +=
              " This video contains content flagged for safety concerns. Please try a different video.";
            break;
          case "DEROGATORY":
            errorMessage +=
              " This video contains language or content that may be offensive. Please try a different video.";
            break;
          default:
            errorMessage +=
              " Try with a different video - educational content works best.";
        }

        throw new Error(errorMessage);
      }

      // Check if response has candidates
      if (
        !result.response.candidates ||
        result.response.candidates.length === 0
      ) {
        console.error("AIService: No response candidates available");
        throw new Error(
          "No response generated. The video might not be accessible or suitable for analysis."
        );
      }

      // Check finish reason
      const finishReason = result.response.candidates[0].finishReason;
      if (finishReason === "SAFETY") {
        console.error("AIService: Response blocked due to safety concerns");
        throw new Error(
          "Content was blocked by safety filters. Try with a different video."
        );
      }

      const text = result.response.text();
      const timestamps = extractTimestampLines(text);

      return timestamps;
    } catch (error) {
      console.error("Error generating timestamps:", error);

      // Handle specific Google AI errors
      if (error.message.includes("Response was blocked")) {
        throw new Error(
          "This video content cannot be analyzed due to safety restrictions. Please try a different video."
        );
      }
      if (error.message.includes("Text not available")) {
        throw new Error(
          "Unable to analyze this video. It may be private, restricted, or not accessible to the AI model."
        );
      }
      if (error.message.includes("SAFETY")) {
        throw new Error(
          "Video content blocked by safety filters. Please try a different video."
        );
      }

      // If it's already a custom error message, pass it through
      if (
        error.message.includes("blocked by safety filters") ||
        error.message.includes("not accessible")
      ) {
        throw error;
      }

      throw new Error(
        "Failed to generate timestamps. Please check your API key and try again with a different video."
      );
    }
  }

  /**
   * Chat with video content
   * @param {string} message - User message
   * @param {string} videoId - YouTube video ID
   * @param {array} context - Previous conversation context
   * @param {array} existingTimestamps - Previously generated timestamps for context
   * @param {AbortSignal} signal - Optional abort signal for cancellation
   * @returns {Promise<object>} - AI response with content and timestamps
   */
  async chatWithVideo(
    message,
    videoId,
    context = [],
    existingTimestamps = [],
    signal = null
  ) {
    try {
      // Check if already cancelled
      if (signal?.aborted) {
        throw new Error("Request was cancelled");
      }

      // Build context from previous messages
      const conversationHistory = context
        .slice(-6)
        .map(
          (msg) =>
            `${msg.type === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n");

      // Build timestamp context
      const timestampContext =
        existingTimestamps.length > 0
          ? `\n\nExisting video timestamps:\n${existingTimestamps
              .slice(0, 10)
              .join("\n")}`
          : "";

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
        6. Be concise and to the point. Do not overwhelm the user with too much information unless they ask for it. 

        Previous conversation:
        ${conversationHistory}

        ${timestampContext}

        User question: ${message}

        Provide a helpful response with natural language and relevant timestamps.`;

      // Check for cancellation before making the request
      if (signal?.aborted) {
        throw new Error("Request was cancelled");
      }

      const result = await this.model.generateContent([
        prompt,
        {
          fileData: {
            fileUri: `https://www.youtube.com/watch?v=${videoId}`,
          },
        },
      ]);

      // Check for cancellation after the request
      if (signal?.aborted) {
        throw new Error("Request was cancelled");
      }

      // Check if response was blocked
      if (result.response.promptFeedback?.blockReason) {
        const blockReason = result.response.promptFeedback.blockReason;
        console.error("AIService: Chat response blocked due to:", blockReason);

        let errorMessage = `Response was blocked by safety filters (${blockReason}).`;

        // Provide specific guidance based on block reason
        switch (blockReason) {
          case "OTHER":
            errorMessage +=
              " This video may contain content that doesn't meet AI safety guidelines. Try asking about educational videos like tutorials, documentaries, or lectures.";
            break;
          case "SAFETY":
            errorMessage +=
              " This video contains content flagged for safety concerns. Please try a different video.";
            break;
          case "DEROGATORY":
            errorMessage +=
              " This video contains language or content that may be offensive. Please try a different video.";
            break;
          default:
            errorMessage +=
              " Try asking about a different video - educational content works best.";
        }

        throw new Error(errorMessage);
      }

      // Check if response has candidates
      if (
        !result.response.candidates ||
        result.response.candidates.length === 0
      ) {
        console.error("AIService: No chat response candidates available");
        throw new Error("No response generated. Try rephrasing your question.");
      }

      // Check finish reason
      const finishReason = result.response.candidates[0].finishReason;
      if (finishReason === "SAFETY") {
        console.error(
          "AIService: Chat response blocked due to safety concerns"
        );
        throw new Error(
          "Response blocked by safety filters. Try asking a different question."
        );
      }

      const responseText = result.response.text();

      // Extract any new timestamps from the response
      const newTimestamps = extractTimestampLines(responseText);

      return {
        content: responseText,
        timestamps: newTimestamps,
        hasTimestamps: newTimestamps.length > 0,
      };
    } catch (error) {
      // Handle cancellation specifically
      if (signal?.aborted || error.message === "Request was cancelled") {
        throw new Error("Request was cancelled");
      }

      // Handle specific Google AI errors
      if (error.message.includes("Response was blocked")) {
        throw new Error(
          "Response blocked by safety filters. Try asking a different question about the video."
        );
      }
      if (error.message.includes("Text not available")) {
        throw new Error(
          "Unable to process your question about this video. Try rephrasing your question."
        );
      }
      if (error.message.includes("SAFETY")) {
        throw new Error(
          "Question blocked by safety filters. Try asking a different question."
        );
      }

      // If it's already a custom error message, pass it through
      if (
        error.message.includes("blocked by safety filters") ||
        error.message.includes("Try asking") ||
        error.message.includes("Try rephrasing")
      ) {
        throw error;
      }

      console.error("Error in chat with video:", error);
      throw new Error("Failed to process your question. Please try again.");
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
        query: query,
      };
    } catch (error) {
      console.error("Error searching video content:", error);
      throw new Error("Failed to search video content. Please try again.");
    }
  }
}

export default AIService;
