// ✅ API Keys (DO NOT EXPOSE in production)

const recordButton = document.getElementById('recordButton');
const chatWindow = document.getElementById('chatWindow');
const sendButton = document.getElementById('sendButton');
const textInput = document.getElementById('userInput');
const typingIndicator = document.getElementById("typingIndicator");

let userProfile = {
  education: '',
  interests: '',
  skills: '',
  location: ''
};
let step = 0;

// 🎙️ Speech Recognition
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;

recordButton.addEventListener('mousedown', () => {
  recordButton.disabled = true;
  recordButton.innerText = "🎙 Listening...";
  recognition.start();
});
recordButton.addEventListener('mouseup', () => recognition.stop());
recognition.onend = () => {
  recordButton.disabled = false;
  recordButton.innerText = "🎙 Hold to Speak";
};
recognition.onresult = async function (event) {
  const userText = event.results[0][0].transcript;
  appendMessage('You', userText);
  await handleAIResponse(userText);
};

// ✍️ Text input
sendButton.addEventListener("click", handleTextInput);
textInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    handleTextInput();
  }
});
function handleTextInput() {
  const userText = textInput.value.trim();
  if (!userText) return;
  appendMessage("You", userText);
  textInput.value = "";
  handleAIResponse(userText);
}

// 💬 Display message with timestamp
function appendMessage(sender, message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-bubble', sender === 'You' ? 'chat-user' : 'chat-bot');

  const avatar = document.createElement('img');
  avatar.classList.add('avatar');
  avatar.src = sender === 'You' ? 'us.png' : 'bot.jpg';

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const content = document.createElement('div');
  content.innerHTML = `
    <strong>${sender}:</strong><br>
    ${sender === "Bot" ? `<div class="response-box">${message}</div>` : message}
    <div class="timestamp">${timestamp}</div>
  `;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(content);
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  saveToHistory(sender, message, timestamp);
}

function saveToHistory(sender, message, timestamp) {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push({ sender, message, timestamp });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadChatHistory() {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-bubble', msg.sender === 'You' ? 'chat-user' : 'chat-bot');

    const avatar = document.createElement('img');
    avatar.classList.add('avatar');
    avatar.src = msg.sender === 'You' ? 'us.png' : 'bot.jpg';

    const content = document.createElement('div');
    content.innerHTML = `
      <strong>${msg.sender}:</strong><br>
      ${msg.sender === "Bot" ? `<div class="response-box">${msg.message}</div>` : msg.message}
      <div class="timestamp">${msg.timestamp}</div>
    `;
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(content);
    chatWindow.appendChild(msgDiv);
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 🧠 Handle AI logic
async function handleAIResponse(text) {
  showTypingIndicator(true);

  if (step === 0) {
    userProfile.education = text;
    appendMessage("Bot", "Thanks! To begin, what best describes your current education level?");
    document.getElementById('quickReplies').innerHTML = `
      <button class="chip">School</button>
      <button class="chip">College</button>
      <button class="chip">Graduate</button>
    `;
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const value = chip.innerText;
        appendMessage("You", value);
        document.getElementById('quickReplies').innerHTML = '';
        handleAIResponse(value);
      });
    });
    step++;
  } else if (step === 1) {
    userProfile.interests = text;
    appendMessage("Bot", "Nice! What are some things you're good at or learning right now? (e.g., research, public speaking, coding, art, problem-solving)");
    step++;
  } else if (step === 2) {
    userProfile.skills = text;
    appendMessage("Bot", "Got it! Finally, which city or country are you based in? This helps me find location-specific opportunities.");
    step++;
  } else if (step === 3) {
    userProfile.location = text;
    appendMessage("Bot", "Perfect! Let me analyze everything and get the best suggestions ready for you... 🎯");
    step++;

    const inputQuery = `
Based on the following user profile:

Education: ${userProfile.education}
Interests: ${userProfile.interests}
Skills: ${userProfile.skills}
Location: ${userProfile.location}

Please provide:
1. Top 3 personalized career paths with reasoning
2. Relevant skill development programs (online/offline)
3. Active scholarships or entrance exams suited to the profile

Respond in a clear and supportive tone, like you're advising a student planning their future.`;

    const response = await getGeminiResponse(inputQuery);
    appendMessage("Bot", response);
    await speakText(response);
  } else {
    const response = await getGeminiResponse(text);
    appendMessage("Bot", response);
    await speakText(response);
  }

  showTypingIndicator(false);
}

// ⏳ Typing indicator
function showTypingIndicator(show) {
  typingIndicator.style.display = show ? "block" : "none";
}

// 🔊 Text-to-speech with OpenAI
// 🔊 Text-to-speech with OpenAI (with 429 handling)
async function speakText(text) {
  try {
    const response = await fetch('/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (response.status === 429) {
      console.warn("⚠️ TTS rate limit hit (429). Skipping voice response.");
      return; // Skip playing audio
    }

    if (!response.ok) {
      const errText = await response.text();
      console.warn("⚠️ TTS failed:", response.status, errText);
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    new Audio(url).play();
  } catch (err) {
    console.warn("⚠️ TTS network error:", err);
  }
}

// 🤖 Gemini API call
async function getGeminiResponse(inputText) {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage: inputText })
    });

    const data = await res.json();
    return data.reply || "No response from Gemini.";
  } catch (e) {
    console.error("Gemini fetch failed:", e);
    return "Gemini API failed.";
  }
}

function resetProfile() {
  userProfile = { education: '', interests: '', skills: '', location: '' };
  step = 0;
  appendMessage("Bot", "Let's start over! What's your education background?");
}

// 🟢 On Load
window.addEventListener("DOMContentLoaded", () => {
  loadChatHistory();
  appendMessage("Bot", "Hi there! I'm Nova 🎓 your career and exam planner. Let's get started! What's your current education background?");
});

// 🧹 Clear Chat
function clearChat() {
  localStorage.removeItem("chatHistory");
  chatWindow.innerHTML = '';
  resetProfile();
}
