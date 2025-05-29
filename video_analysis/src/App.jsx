import { useState } from 'react'
import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai"

function App() {
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
