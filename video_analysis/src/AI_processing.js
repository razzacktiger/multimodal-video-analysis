import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const result = await model.generateContent([
  "Please create time-stamps for the video and make sure its in the format of 00:00 - title.",
  {
    fileData: {
      fileUri: "https://www.youtube.com/watch?v=9hE5-98ZeCg",
    },
  },
]);
console.log(result.response.text());