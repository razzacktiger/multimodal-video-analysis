# 🎥 Multimodal Video Analysis Tool

A powerful React-based web application that revolutionizes how you interact with YouTube videos through AI-powered analysis. Upload any YouTube video and engage with it through intelligent conversation, automated timestamp generation, and frame-based visual search.

## ✨ Features

### 🤖 AI-Powered Video Chat
- **Natural Language Queries**: Ask questions about video content in plain English
- **Context-Aware Responses**: AI understands your video's context for intelligent answers
- **Visual Content Analysis**: Describe what you're looking for and AI will find it
- **Clickable Timestamp Citations**: Responses include hyperlinked timestamps that jump to relevant video moments

### ⏰ Smart Timestamp Generation
- **Automatic Section Breakdown**: AI analyzes and creates meaningful video segments
- **Hyperlinked Navigation**: Click any timestamp to jump directly to that moment
- **Comprehensive Coverage**: Supports both MM:SS and HH:MM:SS formats
- **Scene Descriptions**: Each timestamp includes contextual descriptions

### 🔍 Frame-Based Search
- **Visual Query Processing**: Find specific scenes by describing what you see
- **Multi-modal AI Analysis**: Powered by Google Gemini's advanced vision capabilities
- **Temporal Understanding**: Ask about sequences of events or scene transitions
- **Accurate Results**: High precision in matching descriptions to actual video content

### 💫 Modern User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Interaction**: Fast AI responses with loading indicators
- **Clean Interface**: Modern gradient design with intuitive layout
- **Smooth Animations**: Polished interactions throughout the application

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager
- Google AI API key (Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/multimodal-video-analysis.git
   cd multimodal-video-analysis
   ```

2. **Navigate to the app directory**
   ```bash
   cd video_analysis
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in the video_analysis directory
   cp .env.example .env
   
   # Add your Google AI API key to .env
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to start using the application.

## 🔧 Configuration

### Google AI API Setup
1. Visit the [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key for Gemini
3. Add the key to your `.env` file as `VITE_GOOGLE_AI_API_KEY`

### Supported YouTube URL Formats
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`

## 📖 Usage Guide

### Getting Started
1. **Enter YouTube URL**: Paste any YouTube video link in the input field
2. **Wait for Processing**: The AI will automatically generate timestamps and analysis
3. **Start Chatting**: Ask questions about the video content
4. **Navigate with Timestamps**: Click any timestamp to jump to that moment

### Example Chat Queries
- *"What is the main topic discussed in this video?"*
- *"Show me the part where they talk about machine learning"*
- *"Find the scene with the red car"*
- *"What happens after the 5-minute mark?"*
- *"Summarize the key points from the introduction"*

### Advanced Features
- **Frame Analysis**: Describe visual elements you're looking for
- **Temporal Queries**: Ask about specific time ranges or sequences
- **Content Summarization**: Get overviews of entire videos or sections
- **Visual Search**: Find objects, people, text, or scenes in the video

## 🏗️ Architecture

### Project Structure
```
video_analysis/
├── src/
│   ├── components/          # React components
│   │   ├── VideoPlayer/     # Video embedding and controls
│   │   ├── ChatInterface/   # Chat UI and message handling
│   │   ├── TimestampList/   # Timestamp display and navigation
│   │   └── URLInput/        # Video URL input and validation
│   ├── utils/              # Utility functions
│   │   ├── videoUtils.js   # YouTube URL parsing and validation
│   │   ├── timestampUtils.js # Timestamp formatting and parsing
│   │   └── aiService.js    # Google AI API integration
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── public/                # Static assets
├── package.json          # Dependencies and scripts
└── vite.config.js        # Build configuration
```

### Tech Stack
- **Frontend**: React 19.1.0 with Vite 6.3.5
- **UI Framework**: React Bootstrap + Custom CSS
- **AI Integration**: Google Gemini 2.5 Flash Preview
- **State Management**: React Hooks (useState, useEffect)
- **Video Platform**: YouTube Embed API
- **Build Tool**: Vite with modern ES6+ features

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint code analysis
```

### Development Guidelines
- **Component Structure**: Functional components with hooks
- **Code Style**: ESLint configuration with React best practices
- **File Organization**: Feature-based component grouping
- **State Management**: Local state with hooks, context for global state
- **Error Handling**: Comprehensive error boundaries and user feedback

### Environment Variables
```env
# Required
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key

# Optional
VITE_APP_TITLE=Multimodal Video Analysis Tool
VITE_API_BASE_URL=https://api.example.com
```

## 🔒 Security

### API Key Protection
- API keys are stored in environment variables
- `.env` file is excluded from version control
- Client-side validation for all user inputs
- Secure HTTPS communication with external APIs

### Input Validation
- YouTube URL format validation
- Sanitization of user chat inputs
- Error handling for malformed requests
- Rate limiting considerations for AI API calls

## 🚀 Deployment

### Build Configuration
```bash
# Production build
npm run build

# Build output in dist/ directory
# Deploy dist/ contents to your hosting platform
```

### Hosting Recommendations
- **Vercel**: Optimal for React + Vite applications
- **Netlify**: Easy deployment with environment variable support
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3 + CloudFront**: Scalable enterprise solution

### Environment Setup for Production
1. Set `VITE_GOOGLE_AI_API_KEY` in your hosting platform's environment variables
2. Configure build command: `npm run build`
3. Set publish directory: `dist`
4. Enable HTTPS for secure API communication

## 🐛 Troubleshooting

### Common Issues

**API Key Not Working**
- Verify the key is correctly set in `.env`
- Ensure the key has necessary permissions for Gemini API
- Check for typos in the environment variable name

**Video Not Loading**
- Verify the YouTube URL format is supported
- Check if the video is publicly accessible
- Ensure the video ID is valid

**Chat Not Responding**
- Check browser console for API errors
- Verify internet connection
- Confirm Google AI service status

**Build Failures**
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility (16.0+)
- Verify all environment variables are set

## 📊 Performance

### Optimization Features
- **Lazy Loading**: Components load only when needed
- **API Caching**: Repeated queries use cached responses
- **Efficient Rendering**: React.memo for expensive components
- **Bundle Splitting**: Separate chunks for faster loading

### Performance Metrics
- **Chat Response Time**: < 5 seconds
- **Video Loading**: < 3 seconds for embed
- **Timestamp Generation**: < 30 seconds for typical videos
- **Frame Search Results**: < 10 seconds

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Standards
- Follow React best practices and hooks patterns
- Write clear, self-documenting code
- Include unit tests for new features
- Update documentation for API changes
- Maintain consistent code style with ESLint

## 🙏 Acknowledgments

- **Google AI**: Powered by Gemini 2.5 Flash Preview for multimodal analysis
- **YouTube**: Video platform integration and embedding
- **React Community**: Framework and ecosystem support
- **Bootstrap**: UI component library and responsive design

## 📞 Support

- 📧 Email: harrazzack@gmail.com

---

**Built with ❤️ using React, Google AI, and modern web technologies** 
