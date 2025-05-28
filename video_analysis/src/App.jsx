import { useState } from 'react'
import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai"

function App() {
  const [count, setCount] = useState(0)

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSubmit = async () => {
    console.log('Submitted URL:', inputValue);
    
    const genAI = new GoogleGenerativeAI("");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      "Please create time-stamps for the video and make sure its in the format of 00:00 - title.",
      {
        fileData: {
          fileUri: inputValue, // Use the input value from the user
        },
      },
    ]);
    const responseText = result.response ? await result.response.text() : 'No response received';
    console.log(responseText);
    setResponseText(responseText);
  };

  return (
    <>
    <div>
      <h2 className='title'>Multimodal Video Analysis Tool</h2>
    </div>
    <div className='userInput'>
      <label>
        Enter your link here: <input 
          name="myInput" 
          value={inputValue} 
          onChange={handleInputChange} 
        />
      </label>
    </div>
    <div>
      <button 
        className='submit-button'
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
    </>
  )
}

export default App
