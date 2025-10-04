// main.js

const sendBtn = document.getElementById('send');
const inputBox = document.getElementById('input');
const messages = document.getElementById('messages');

// 🔑 Apni Groq API key yaha daal do
const API_KEY = "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ------------------------
// Local brain (offline responses)
// ------------------------
function aurynLocalBrain(userInput) {
  const input = userInput.toLowerCase();

  if (input.includes("who made you") || input.includes("developer")) {
    return "I was developed by Ojas, a solo developer. He built me entirely on a mobile phone as a personal AI assistant project.";
  } else if (input.includes("hello") || input.includes("hi auryn")) {
    return "Hello, I am Auryn [Orion]! How can I help you today?";
  } else if (input.includes("exit") || input.includes("quit")) {
    return "exit";
  } else if (input.includes("guess number")) {
    return "🕹️ Game mode not available here. (Can be added later).";
  } else {
    return null; // pass to API
  }
}

// ------------------------
// Append message to chat window
// ------------------------
function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`; // user -> right, ai -> left
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'bubble';
  bubbleDiv.textContent = text;
  msgDiv.appendChild(bubbleDiv);
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// ------------------------
// Page load AI greeting
// ------------------------
window.addEventListener('DOMContentLoaded', () => {
  const greetMsg = "🤖 Hi! I'm Auryn, made by Ojas 😎, your personal AI assistant at your service! 🎉";
  appendMessage(greetMsg, 'left');
});

// ------------------------
// Call Groq API
// ------------------------
async function aurynGroqAI(userInput) {
  appendMessage(userInput, 'right'); // user message on right

  const payload = {
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: "You are Auryn, a helpful AI assistant." },
      { role: "user", content: userInput }
    ],
    max_tokens: 300
  };

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
    appendMessage(aiText, 'left'); // AI message on left
  } catch (error) {
    console.error("Error:", error);
    appendMessage("⚠️ Something went wrong with the AI request.", 'left');
  }
}

// ------------------------
// Handle user input
// ------------------------
async function handleInput() {
  const userInput = inputBox.value.trim();
  if (!userInput) return;
  inputBox.value = '';

  // 1️⃣ Local brain check
  const localReply = aurynLocalBrain(userInput);
  if (localReply === "exit") {
    appendMessage("Auryn: Shutting down. Goodbye 👋", 'left');
    return;
  } else if (localReply) {
    appendMessage(localReply, 'left');
  } else {
    // 2️⃣ Fallback to Groq AI
    appendMessage("(thinking with Auryn AI...)", 'left');
    await aurynGroqAI(userInput);
  }
}

// Event listeners
sendBtn.addEventListener('click', handleInput);
inputBox.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleInput();
  }
});