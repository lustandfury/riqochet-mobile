// Test script to verify Gemini API key setup
// Run with: node test-api.js

const { GoogleGenAI } = require("@google/genai");

async function testApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ GEMINI_API_KEY not found in environment variables');
    console.log('\nTo fix this:');
    console.log('1. Create .env.local file with: GEMINI_API_KEY=your_key_here');
    console.log('2. Or set environment variable in your terminal');
    return false;
  }

  console.log('✅ GEMINI_API_KEY found');
  console.log('🔑 Testing API key...');

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Test with a simple text generation
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, can you generate a simple response?");
    
    console.log('✅ API key is valid and working!');
    console.log('\n📝 Test response:', result.response.text());
    return true;
    
  } catch (error) {
    console.log('❌ API key test failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes('invalid')) {
      console.log('\n💡 Your API key might be invalid or expired');
    } else if (error.message.includes('quota')) {
      console.log('\n💡 You might have exceeded your quota');
    } else if (error.message.includes('permission')) {
      console.log('\n💡 Your API key might not have the right permissions');
    }
    
    return false;
  }
}

testApiKey();
